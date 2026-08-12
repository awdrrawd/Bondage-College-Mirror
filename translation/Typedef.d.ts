/**
 * 翻译函数
 * @param src 要翻译的原文本
 * @returns 翻译后的字符串，如果没有找到对应的翻译，则返回 undefined
 */
type TranslationFunction = (src: string) => string | undefined;

/**
 * 翻译单元
 * @param translateActivityText 翻译活动文本的函数
 * @param translateMenuText 翻译菜单文本的函数
 */
type TranslationUnit = {
    /** 翻译输聊天中的活动文本 */
    translateActivityText?: TranslationFunction;
    /** 翻译插件菜单 */
    translateMenuText?: TranslationFunction;
    /** 翻译本地消息，例如 BCX 的 .help */
    translateLocalMessage?: TranslationFunction;
    /** 叠加到其他资料页面上的内容翻译，例如 FetishShared */
    translatePreferenceOverlay?: TranslationFunction;
};

type DOMObserverModifier = {
    filter: (node: Node) => boolean;
    action: (node: Node) => void;
};

type HookManagerType = typeof import('@sugarch/bc-mod-hook-manager')['HookManager'];
