const translation = {
    // EBCH
    "EBCH: Turn on Ungarble (Hearing Whitelist)": "EBCH: 打开去噪(听觉白名单)",
    "EBCH: Turn off custom notifications": "EBCH: 关闭自定义通知",
    "EBCH: Turn on chatlogging": "EBCH: 打开聊天记录",
    "EBCH: Turn on Ungarble (all)": "EBCH: 打开去噪(全部)",
    "EBCH: Turn on custom notifications": "EBCH: 打开自定义通知",
    "EBCH: Turn off ungarble": "EBCH: 关闭去噪",
    "EBCH: Preparing DB.": "EBCH: 准备数据库.",
    "EBCH: DB Ready.": "EBCH: 数据库准备就绪.",
    "EBCH: Turn off chatlogging": "EBCH: 关闭聊天记录",
    "EBCH: Pose UI on": "EBCH: 打开POSE UI",
    "BaseHand": "基础手势",
    "HandsUp": "举手",
    "HandsHigh": "高举双手",
    "BackLoose": "轻松背手",
    "BackTight": "紧绷背手",
    "Standing": "站立",
    "Kneeling": "跪姿",
    "KneelSpr": "跪地张腿",
    "StandCl": "站立闭合",
    "StandSpr": "站立张退",
    "BellyLie": "仰卧",
    "AllFours": "四肢着地",
    "EBCH: Pose UI off": "EBCH: 关闭POSE UI",
    "Base Hands": "基础手势",
    "Hands Up": "举手",
    "Hands Up High": "高举双手",
    "Back Loose": "轻松背手",
    "Back Tight": "紧绷背手",
    "Stand": "站立",
    "Kneel": "跪姿",
    "Kneel Spread": "跪地张腿",
    "Standing Closed Legs": "站立闭合腿",
    "Standing Spread": "站立张腿",
    "Belly Lie": "仰卧",
    "All Fours": "四肢着地",
};

/**
 * 翻译菜单文本
 * @param {string} key
 * @returns {string | undefined} 如果翻译成功则返回翻译后的文本，否则返回undefined
 */
export function translateMenuText(key) {
    if (translation[key]) return translation[key];
    return undefined;
}

/** @type {TranslationUnit} */
export const EBCH = {
    translateMenuText,
};
