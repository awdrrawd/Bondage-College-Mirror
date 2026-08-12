import { nodeIsHTML, translateNode } from "./utils";

/**
 <div id="mbs-preference-reset-background">
 <h1>MBS data reset</h1>
 <p><strong>- Warning -</strong></p>
 <p>If you confirm, <i>all</i> MBS data (including settings, overrides, and current states) will be permanently reset!</p>
 <p>You will be able to continue using MBS, but all of your configuration will be reset to default!</p>
 <p><strong>This action cannot be undone!</strong></p>
 <div id="mbs-preference-reset-grid">
 <button class="mbs-button" disabled="" id="mbs-preference-reset-accept">Confirm (4)</button>
 <button class="mbs-button" id="mbs-preference-reset-cancel">Cancel</button>
 </div></div>
 */

const translation = {
    "MBS Settings": "MBS 设置",
    "Wheel of fortune settings": "幸运转盘设置",
    "Configure the wheel of fortune": "配置幸运转盘",
    "Allow wheel rolling while restrained": "束缚时允许转动转盘",
    "Lock MBS settings while restrained": "束缚时锁定MBS设置",

    [`<strong>Experimental</strong>: whether gags will use an alternative form of, more phonetically accurate, speech garbling based on <a href="https://github.com/CordeliaMist/Dalamud-GagSpeak" target="_blank">Dalamud-GagSpeak</a>`]: `<strong>实验功能</strong>: gags 是否会使用基于 <a href="https://github.com/CordeliaMist/Dalamud-GagSpeak" target="_blank">Dalamud-GagSpeak</a> 的替代形式的、更语音准确的语音混淆`,

    [`Incompatible-ish with <a href="https://wce-docs.vercel.app/docs/intro" target="_blank">WCE/FBC</a>'s garbling anti-cheat as of the moment`]: `目前不兼容 <a href="https://wce-docs.vercel.app/docs/intro" target="_blank">WCE/FBC</a> 的防作弊功能`,

    "Whether to heaviest gags will drop up to half of all trailing characters when alternate garbling is enabled":
        "当启用替代混淆时, 是否最重的 gag 会丢弃多达一半的尾随字符",
    "Interpolate between the three alternative garbling levels, allowing for a more gradual increase in garbling strength (on a syllable by syllable basis) as the gag level increases":
        "在三种替代混淆级别之间插值, 允许随着 gag 等级的提高, 混淆强度 (逐音节) 更加渐进地增加",

    "Misc settings": "杂项设置",
    "Show the MBS changelog in chat whenever a new MBS version is released":
        "每当发布新版本的 MBS 时, 在聊天中显示 MBS 更新日志",

    "Crafting settings": "制作物品设置",
    [`Allow crafted item descriptions to use up to 398 "simple" characters (<i>e.g.</i> no smilies or other non-ASCII characters).<br>Note: Available in unmodded Bondage Club as of R109; see the crafting screen`]: `允许制作的物品描述使用多达 398 个“简单”字符 (<i>例如</i> 没有表情符号或其他非 ASCII 字符).<br>注意: 在 R109 的未修改的束缚俱乐部中可用; 请参阅制作屏幕`,

    "Reset MBS": "重置 MBS",
    "Import": "导入",
    "Export": "导出",
    "Clear all MBS data": "清除所有MBS数据",
    "Reset": "重置",
    "Latest Changes": "最新更改",
    "Export MBS settings": "导出 MBS 设置",
    "Import MBS settings": "导入 MBS 设置",
    "Open the MBS changelog": "打开 MBS 更新日志",

    "Fortune wheel item sets": "幸运转盘物品集",
    "Fortune wheel commands": "幸运转盘命令",

    "MBS data reset": "MBS 数据重置",
    "- Warning -": "- 警告 -",
    "If you confirm, <i>all</i> MBS data (including settings, overrides, and current states) will be permanently reset!":
        "如果你确认, <i>所有</i> MBS 数据 (包括设置、覆盖和当前状态) 将被永久重置!",
    "You will be able to continue using MBS, but all of your configuration will be reset to default!":
        "你将能够继续使用 MBS, 但所有配置将重置为默认值!",
    "This action cannot be undone!": "此操作无法撤消!",
    "Confirm": "确认",
    "Cancel": "取消",
};

const prefixTranslation = {
    "Maid's Bondage Scripts": "Maid的束缚脚本",
};

const suffixTranslation = {
    "&lt;Empty&gt;": "&lt;空&gt;",
};

function xfix(text) {
    for (const [key, value] of Object.entries(prefixTranslation)) {
        if (text.startsWith(key)) {
            return text.replace(key, value);
        }
    }
    for (const [key, value] of Object.entries(suffixTranslation)) {
        if (text.endsWith(key)) {
            return text.replace(key, value);
        }
    }
    return undefined;
}

const translate = (text) => xfix(text) || translation[text];

/** @type {DOMObserverModifier} */
export const MBS = {
    filter: (node) =>
        nodeIsHTML(node) &&
        (node.matches("#mbs-preference") ||
            node.matches("#mbs-preference-reset-screen") ||
            node.matches("#mbs-fwselect")),
    action: (node) => {
        if (nodeIsHTML(node)) node.querySelectorAll("*").forEach((child) => translateNode(child, translate));
    },
};
