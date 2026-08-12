import { HookManager } from "@sugarch/bc-mod-hook-manager";
import { ActivityManager } from "../../activityForward";
import { load, save } from "./dataAccess";
import { Logger } from "@mod-utils/log";

/**
 * @typedef { {Name:string, Target?:string, TargetSelf?: string, Dialog?:string, DialogSelf?:string} } ActivityDataItem
 */

function stringToHash(src) {
    let hash = 0;
    if (src.length === 0) return hash;
    for (let i = 0; i < src.length; i++) {
        const char = src.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

/**
 * @param {string} actName
 * @returns {ActivityName}
 */
export function activityName(actName) {
    return /** @type {ActivityName} */ (`笨蛋笨Luzi_${stringToHash(`${Player.MemberNumber}/${actName}`)}`);
}

/**
 * @param {any} data
 * @returns {Record<string, ActivityDataItem>}
 */
function validate(data) {
    /** @type {Record<string, ActivityDataItem>} */
    const ret = {};
    if (typeof ret !== "object") return ret;

    Object.entries(data).forEach(([key, value]) => {
        if (typeof key !== "string" || typeof value !== "object" || !value) return;
        if (typeof value.Name !== "string") return;
        if (value.Target && (typeof value.Target !== "string" || typeof value.Dialog !== "string")) return;
        if (value.TargetSelf && (typeof value.TargetSelf !== "string" || typeof value.DialogSelf !== "string")) return;
        ret[key] = value;
    });

    return ret;
}

const DATA_KEY = "动作数据";

class ActivityData {
    constructor() {
        /** @type {Record<string, ActivityDataItem>} */
        this.data = validate(
            (() => {
                const ret = load(DATA_KEY);
                if (Object.keys(ret).length === 0) return load(ActivityData.name);
                return ret;
            })()
        );
        Object.values(this.data).forEach((act) => this.registerAct(act));
    }

    /**
     * @param {ActivityDataItem[]} acts
     */
    addActivities(acts) {
        acts.forEach((act) => {
            if (this.data[act.Name]) return;
            if (!ActivityManager.checkActivityAvailability(activityName(act.Name))) return;
            this.data[act.Name] = act;
            this.registerAct(act);
        });
        this.save();
    }

    /**
     * @param {ActivityDataItem} act
     * @returns {boolean} 如果添加成功返回true
     */
    addActivity(act) {
        if (this.data[act.Name]) return false;
        if (!ActivityManager.checkActivityAvailability(activityName(act.Name))) return false;
        this.data[act.Name] = act;
        this.registerAct(act);
        this.save();
        return true;
    }

    /**
     * @param {string} actName
     * @returns { boolean}
     */
    activityAvailable(actName) {
        return this.data[actName] === undefined;
    }

    /**
     * @param {string} actName
     */
    removeActivity(actName) {
        const name = activityName(actName);
        ActivityManager.removeCustomActivity(name);
        delete this.data[actName];
        this.save();
    }

    /**
     *
     * @param {ActivityDataItem} act
     */
    registerAct(act) {
        if (!act.Name) {
            Logger.warn(`动作名称为空 : ${JSON.stringify(act)}`);
            return;
        }

        /** @type { CustomActivity } */
        const nAct = {
            activity: {
                Name: activityName(act.Name),
                Prerequisite: [],
                MaxProgress: 0,
                Target: /** @type {AssetGroupItemName[]}*/ (act.Target ? [act.Target] : []),
                TargetSelf: /** @type {AssetGroupItemName[]}*/ (act.TargetSelf ? [act.TargetSelf] : []),
            },
            label: {
                [TranslationLanguage]: act.Name,
            },
            dialog: {
                [TranslationLanguage]: act.Dialog || act.Name,
            },
            dialogSelf: {
                [TranslationLanguage]: act.DialogSelf || act.Name,
            },
        };

        ActivityManager.addCustomActivity(nAct);
    }

    save() {
        save(DATA_KEY, this.data);
    }

    clear() {
        Object.keys(this.data).forEach((key) => {
            ActivityManager.removeCustomActivity(activityName(key));
        });

        this.data = {};
        this.save();
    }
}

/** @type {ActivityData | undefined} */
let data = undefined;
export default function () {
    HookManager.afterPlayerLogin(() => {
        data = new ActivityData();

        const olddata = /** @type {any} */ (Player.OnlineSettings).ECHO;
        if (olddata) {
            // 如果存在旧数据
            const { 炉子ActivityFemale3DCG, 炉子ActivityDictionary } = olddata;
            if (炉子ActivityFemale3DCG !== undefined && 炉子ActivityDictionary !== undefined) {
                console.info("迁移动作数据");
                try {
                    /** @type {Activity[]} */
                    const decompressedActivity = JSON.parse(LZString.decompressFromUTF16(炉子ActivityFemale3DCG));
                    /** @type {[string,string][]} */
                    const decompressedDictionary = JSON.parse(LZString.decompressFromUTF16(炉子ActivityDictionary));

                    const oldPrefix = "笨蛋笨Luzi_";

                    /** @type {ActivityDataItem[]} */
                    const resultActivity = [];
                    decompressedActivity.forEach((act) => {
                        if (ActivityManager.checkActivityAvailability(act.Name)) {
                            resultActivity.push({
                                Name: act.Name.startsWith(oldPrefix) ? act.Name.slice(oldPrefix.length) : act.Name,
                                Target: act.Target?.[0] || "",
                                TargetSelf: (() => {
                                    if (typeof act.TargetSelf === "boolean")
                                        if (act.TargetSelf) return act.Target?.[0] || "";
                                    if (Array.isArray(act.TargetSelf)) return act.TargetSelf[0] || "";
                                })(),
                            });
                        }
                    });

                    resultActivity.forEach((data) => {
                        const selfdialog = decompressedDictionary.find(
                            ([k]) => k === `ChatSelf-${data.TargetSelf}-${oldPrefix}${data.Name}`
                        );
                        if (selfdialog) data.DialogSelf = selfdialog[1];
                        const targetdialog = decompressedDictionary.find(
                            ([k]) => k === `ChatOther-${data.Target}-${oldPrefix}${data.Name}`
                        );
                        if (selfdialog) data.Dialog = targetdialog[1];
                    });

                    data.addActivities(resultActivity);
                    delete olddata["炉子ActivityFemale3DCG"];
                    delete olddata["炉子ActivityDictionary"];
                    ServerAccountUpdate.QueueData({ OnlineSettings: Player.OnlineSettings });
                } catch (e) {
                    Logger.error(e);
                }
            }
        }
    });
}

export function activityDataManager() {
    return data;
}
