const translation = {
    "FetishShare": "癖好分享",
    "Fetish & Activity Settings": "癖好&动作喜好设置",
    "Fetishes": "癖好",
    "Fetish & Activity Compatibility:": "癖好&动作喜好相似度: ",
    "Always read bios and ask for consent & limits. Users might not keep these up to date.":
        "始终阅读个人简介并征求同意和了解限制. 用户可能不会及时更新这些信息.",
    "Activities (done to/by 她)": "动作喜好（对她所做/由她所做）",
    "Hide neutral activities": "隐藏 无所谓的动作",
    "Hide self-only activities": "隐藏 自己喜好做的动作",
    "Show compatibility percentage in chat rooms": "在聊天室中显示癖好相似度",
    "(Not recommended) Opt-out of others seeing your fetishes & activities through this plugin.":
        "(不推荐) 选择不让其他人通过此插件看到您的癖好&动作.",
    "Fetishes: N/A ｜ Activities: N/A": "癖好: N/A ｜ 动作: N/A",
    "BC Fetish & Activity Settings": "BC 癖好与活动设置",
    "This mod is new and will get more features. It shows the base game's basic Fetishes & Activities settings. In the future, you'll see more if both players use this mod. Find problems or have ideas? Check the buttons below. Love, Maple ❤️":
        "本模组是新开发的，未来会添加更多功能。它展示了游戏基础的癖好与活动设置。如果双方玩家都使用此模组，未来您将看到更多内容。发现问题或有想法？请查看下方按钮。爱你的，Maple ❤️",
    "Site": "网站",
    "Source Code": "源代码",
    "Bugs & Ideas": "问题与建议",
};

/**
 * 翻译菜单文本
 * @param {string} key
 * @returns {string | undefined} 如果翻译成功则返回翻译后的文本，否则返回undefined
 */
export function translateMenuText(key) {
    if (/** @type {string} */ (CurrentScreen) !== "FetishScreen") return undefined;
    if (translation[key]) return translation[key];
    return undefined;
}

/** @type {TranslationUnit} */
export const FetishShare = {
    translateMenuText,
};
