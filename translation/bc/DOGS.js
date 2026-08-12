const translation = {
    // 主要分类
    "Remote Control": "远程控制",
    "Devious Padlock": "恶作剧锁",
    "Misc": "其他",
    "Devious Obligate Great Stuff (DOGS) - Main Menu": "恶作剧好东西 (DOGS) - 主菜单",
    "Devious Obligate Great Stuff (DOGS) - General": "恶作剧好东西 (DOGS) - 常规设置",
    "Devious Obligate Great Stuff (DOGS) - Remote Control": "恶作剧好东西 (DOGS) - 远程控制",
    "Devious Obligate Great Stuff (DOGS) - Devious Padlock": "恶作剧好东西 (DOGS) - 恶作剧锁",
    "Devious Obligate Great Stuff (DOGS) - Misc": "恶作剧好东西 (DOGS) - 其他设置",

    // 基本设置
    "Enabled": "已启用",
    "Notify others": "通知他人",

    // 权限设置
    "Who can use remote control on you": "谁可以对你使用远程控制",
    "Who can put devious padlock on you": "谁可以对你使用恶作剧锁",
    "Everyone": "所有人",
    "Friends and higher": "好友及以上",
    "Whitelist and higher": "白名单及以上",
    "Lovers and higher": "恋人及以上",

    // 其他设置
    "Delete local messages after delay": "延迟后删除本地消息",
    "Automatically show changelog": "自动显示更新日志",

    // 远程控制说明
    "Remote control lets allowed users to remotely": "远程控制功能允许获得授权的用户",
    "change your appearance, now you don't need to be": "远程更改你的外观，现在你无需",
    "in the same room to change items of your friends.": "在同一房间内就能更改好友的装扮。",
    "If remote control is disabled then no one can use": "如果远程控制被禁用，任何人都无法",
    'it on you. Type "/dogs remote <member number>" to': '对你使用此功能。输入 "/dogs remote <成员编号>" 来',
    "connect remotely. ": "建立远程连接。",

    // 恶作剧锁说明
    "The padlock is made in such a way that the wearer": "这种锁的特殊设计使佩戴者无法自行解开。",
    "cannot remove it on their own. In the padlock": "在锁的设置中，",
    "settings you can add notes and configure access": "你可以添加备注并设置访问权限。",
    "rights. By default these padlocks are disabled": "默认情况下，这些锁是禁用的",
    "and cannot be used on you, but you can always": "且无法对你使用，但你随时可以",
    "change it :3 ": "更改这个设置哦 :3",

    "Emergency Reset": "紧急重置",

    'Unavailable (Requires "Roleplay" difficulty)': '不可用（需要 "角色扮演" 难度）',

    "Reset all configurations of": "重置所有佩戴的",
    "worn devious padlocks": "恶作剧锁配置",
    "including access permission ": "包括访问权限",

    "Instantly remove all devious": "立即从自己身上移除",
    "padlocks from yourself ": "所有恶作剧锁",
    "Instant Release": "立即释放",
};

/**
 * 翻译菜单文本
 * @param {string} key
 * @returns {string | undefined} 如果翻译成功则返回翻译后的文本，否则返回undefined
 */
export function translateMenuText(key) {
    if (PreferenceExtensionsCurrent?.Identifier !== "DOGS") return undefined;
    if (translation[key]) return translation[key];
    return undefined;
}

/** @type {TranslationUnit} */
export const DOGS = {
    translateMenuText,
};
