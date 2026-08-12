import { ModInfo } from "@mod-utils/rollupHelper";
import { HookManager } from "@sugarch/bc-mod-hook-manager";
import { hanburgerIcon } from "./动作菜单标志";
import { i18n } from "../../i18n";

/** @type {Partial<Record<CustomGroupName,Set<string> | "any">>} */
const speakingAssets = {
    ItemMisc: new Set(["TeddyBear", "PetPotato", "BunPlush", "FoxPlush", "Karl"]),
    ItemHandheld: new Set(["Shark", "伊偶", "Smartphone", "Phone1", "Phone2"]),
};

/** @type {Partial<Record<CustomGroupName,Set<string> | "any">>} */
const hearingAssets = {
    ItemEars: "any",
};

const iso639_1_codes = new Set(
    `
    aa ab ae af ak am an ar as av ay az
    ba be bg bh bi bm bn bo br bs
    ca ce ch co cr cs cu cv cy
    da de dv dz
    ee el en eo es et eu
    fa ff fi fj fo fr fy
    ga gd gl gn gu gv
    ha he hi ho hr ht hu hy hz
    ia id ie ig ii ik io is it iu
    ja jv
    ka kg ki kj kk kl km kn ko kr ks ku kv kw ky
    la lb lg li ln lo lt lu lv
    mg mh mi mk ml mn mr ms mt my
    na nb nd ne ng nl nn no nr nv ny
    oc oj om or os
    pa pi pl ps pt
    qu
    rm rn ro ru rw
    sa sc sd se sg sh si sk sl sm sn so sq sr ss st su sv sw
    ta te tg th ti tk tl tn to tr ts tt tw ty
    ug uk ur uz
    ve vi vo
    wa wo
    xh
    yi yo
    za zh zu
    `
        .trim()
        .split("\n")
        .map((x) => x.split(" "))
        .flat()
        .filter((x) => x.length > 0)
);

/** @type {Translation.String} */
const messages = {
    CN: {
        hearing: `[${ModInfo.name}] 📞 翻译你听到的话为 {0}`,
        speaking: `[${ModInfo.name}] 🔊 翻译你说出的话为 {0}`,
    },
    EN: {
        hearing: `[${ModInfo.name}] 📞 Translate what you hear to {0}`,
        speaking: `[${ModInfo.name}] 🔊 Translate what you say to {0}`,
    },
};

/**
 * @param {string} key - 消息键值
 * @param {...string} args - 格式化参数
 * @returns {string} - 本地化后的消息
 */
const getMessage = (key, ...args) => i18n(messages, key, ...args);

/**
 * @param {Item} item
 * @returns {string | undefined} language code if valid, undefined if not
 */
function fetchLangCode(item) {
    const m = item.Craft?.Description?.match(/\[([a-z]{2})(-[a-z]{1,4})?\]/i);
    if (m && iso639_1_codes.has(m[1].toLowerCase())) {
        return m[1].toLowerCase() + (m[2] ?? "");
    }
    return undefined;
}

/**
 * @param {Partial<Record<CustomGroupName,Set<string> | "any">>} assetFilter
 * @param {Asset | Item} item
 * @returns {string | undefined} language code if valid, undefined if not
 */
function checkAttr(assetFilter, item) {
    if (!("Asset" in item)) return undefined;
    const groupName = item.Asset.Group.Name;
    if (assetFilter[groupName] === "any" || assetFilter[groupName]?.has(item.Asset.Name)) {
        const langCode = fetchLangCode(item);
        if (langCode) return langCode;
    }
    return undefined;
}

/**
 * @param {Partial<Record<CustomGroupName,Set<string> | "any">>} vAssets
 * @returns {string | undefined}
 */
function validItemCraftingDesc(vAssets) {
    for (const [groupName, assets] of Object.entries(vAssets)) {
        const item = InventoryGet(Player, /** @type{any}*/ (groupName));
        if (item && (assets === "any" || assets.has(item.Asset.Name))) {
            const langCode = fetchLangCode(item);
            if (langCode) return langCode;
        }
    }
    return undefined;
}

/**
 * @param {string} sourceText
 * @param {string} targetLang
 * @returns {Promise<{ valid: boolean, translatedText: string }>}
 */
async function translateText(sourceText, targetLang) {
    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
                sourceText
            )}`
        );
        const data = await response.json();
        const translatedText = data[0].map((i) => i[0]).join(" ");
        const retSourceLang = data[2];
        const valid = retSourceLang !== targetLang && translatedText !== sourceText;
        return { valid, translatedText };
    } catch (e) {
        console.error(e);
        return;
    }
}

/**
 * 添加图标属性
 * @param {string | undefined} code - 语言代码
 * @param {string} messageKey - 消息键值
 * @param {ElementButton.CustomIcon[]} iconAttr - 图标属性数组
 */
function addIconAttribute(code, messageKey, iconAttr) {
    if (code) {
        iconAttr.push({
            name: `echo-translator-${messageKey}`,
            iconSrc: hanburgerIcon,
            tooltipText: getMessage(messageKey, code),
        });
    }
    return iconAttr;
}

export default function () {
    HookManager.progressiveHook("ChatRoomMessageDisplay").inject((args) => {
        const data = args[0];
        if (["Chat", "Whisper", "Emote"].includes(data.Type)) {
            if (Array.isArray(data.Dictionary) && data.Dictionary.find((d) => d["AutoTranslated"])) return;
            if (["\\", "/", "www"].some((s) => data.Content.includes(s))) return;
            const modedData = (prefix, text) => ({
                ...data,
                Content: `${prefix} ${text}`,
                Dictionary: /** @type {ChatMessageDictionary} */ ([{ Automatic: true }, { AutoTranslated: true }]),
            });

            if (data.Sender === Player.MemberNumber) {
                const tLang = validItemCraftingDesc(speakingAssets);
                if (tLang)
                    translateText(data.Content, tLang).then(({ valid, translatedText }) => {
                        if (valid) ServerSend("ChatRoomChat", modedData("🔊", translatedText));
                    });
            } else {
                const tLang = validItemCraftingDesc(hearingAssets);
                if (tLang)
                    translateText(data.Content, tLang).then(({ valid, translatedText }) => {
                        if (valid) ChatRoomMessage(modedData("📞", translatedText));
                    });
            }
        }
    });

    HookManager.hookFunction("ElementButton.CreateForAsset", 0, (args, next) => {
        const item = args[1];
        if ("Asset" in item) {
            const iconAttr = [
                { code: checkAttr(hearingAssets, item), messageKey: "hearing" },
                { code: checkAttr(speakingAssets, item), messageKey: "speaking" },
            ].reduce((acc, { code, messageKey }) => addIconAttribute(code, messageKey, acc), []);

            if (iconAttr.length > 0) {
                args[4] = {
                    ...args[4],
                    icons: [...(args[4].icons ?? []), ...iconAttr],
                };
            }
        }
        return next(args);
    });
}
