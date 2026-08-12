import { TranslationUtility } from "@sugarch/bc-mod-i18n";

/**
 * 根据当前游戏语言获取消息
 * @param {Translation.String} messages - 包含不同语言消息的对象
 * @param {string} key - 消息键值
 * @param {...string} args - 格式化参数
 * @returns {string} - 本地化后的消息
 */
export function i18n(messages, key, ...args) {
    let msg = TranslationUtility.translateString(messages, key);
    // 替换格式化参数
    args.forEach((arg, index) => {
        msg = msg.replace(`{${index}}`, arg);
    });
    return msg;
}
