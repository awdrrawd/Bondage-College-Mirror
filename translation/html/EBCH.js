const translation = {
    "EBCH: /ebch for commands.": "EBCH：/ebch获取命令。",
    [`EBCH Commands:
<i>/ebch</i> or <i>/ebch help</i>: Diplays this help menu.
<i>/ebch reset</i>: Resets EBCH settings to default.
<i>/ebch welcome</i>: Toggles welcome message on and off.
<i>/ebch log</i>: Displays chatlogging related help.
<i>/ebch notifs</i>: Displays custom notifications related help.
<i>/ebch ungarble</i>: Displays ungarble related help.
<i>/ebch pose</i>: Displays pose related help.`]: `<b>EBCH命令：</b>
<i>/ebch</i>或<i>/ebch help</i>：显示此帮助菜单。
<i>/ebch reset</i>：将EBCH设置重置为默认值。
<i>/ebch welcome</i>：打开和关闭欢迎消息。
<i>/ebch log</i>：显示与聊天记录相关的帮助。
<i>/ebch notifs</i>：显示与自定义通知相关的帮助。
<i>/ebch ungarble</i>：显示与解码相关的帮助。
<i>/ebch pose</i>：显示与姿势相关的帮助。`,
};

/** @type {TranslationFunction} */
export function EBCHHelp(src) {
    if (translation[src]) return translation[src];
    return undefined;
}
