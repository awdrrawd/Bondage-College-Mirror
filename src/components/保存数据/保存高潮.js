import { HookManager } from "@sugarch/bc-mod-hook-manager";
import { load, save } from "./dataAccess";

const DATA_KEY = "高潮数据";

class OrgasmData {
    constructor() {
        /** @type {boolean} */
        this.isOn = false;
        /** @type {number} */
        this.counter = 0;

        /** @type {{高潮开关:boolean, 高潮次数:number }} */
        const data = (() => {
            const ret = load(DATA_KEY);
            if (Object.keys(ret).length === 0) return load(OrgasmData.name);
            return ret;
        })();
        if (data) {
            this.isOn = data.高潮开关;
            this.counter = data.高潮次数;
        }
    }

    /**
     *
     * @param {Object} param0
     * @param {boolean} [param0.高潮开关] 高潮开关
     * @param {number} [param0.高潮次数] 高潮次数
     */
    setValue({ 高潮开关, 高潮次数 } = {}) {
        if (高潮开关 !== undefined) this.isOn = 高潮开关;
        if (高潮次数 !== undefined) this.counter = 高潮次数;
        this.save();
    }

    increase() {
        if (this.isOn) {
            this.counter++;
            this.save();
        }
    }

    data() {
        return {
            高潮开关: this.isOn,
            高潮次数: this.counter,
        };
    }

    save() {
        save(DATA_KEY, this.data());
    }
}

/** @type { OrgasmData | undefined } */
let data = undefined;

/**
 *
 * @param { { 高潮开关?:boolean, 高潮次数?:number } } param0
 */
export function 设置高潮数据(param0) {
    data?.setValue(param0);
}

/** @returns {boolean} */
export function 高潮数据开关() {
    return data?.data().高潮开关;
}

export default function () {
    HookManager.afterPlayerLogin(() => {
        data = new OrgasmData();

        const olddata = /** @type {any} */ (Player.OnlineSettings).ECHO;
        if (olddata) {
            // 如果存在旧数据
            const { 高潮开关, 高潮次数 } = olddata;
            if (高潮开关 !== undefined || 高潮次数 !== undefined) {
                console.info("迁移高潮数据");
                data.setValue(olddata);
                delete olddata["高潮开关"];
                delete olddata["高潮次数"];
                ServerAccountUpdate.QueueData({ OnlineSettings: Player.OnlineSettings });
            }
        }
    });

    HookManager.hookFunction("ChatRoomRun", 1, (args, next) => {
        if (data?.isOn && Player.ArousalSettings?.OrgasmCount !== undefined) {
            Player.ArousalSettings.OrgasmCount = data?.counter;
        }
        next(args);
    });

    HookManager.hookFunction("ActivityOrgasmStart", 1, (args, next) => {
        const [C] = args;
        if (C.IsPlayer() && !ActivityOrgasmRuined) {
            data?.increase();
        }
        next(args);
    });
}
