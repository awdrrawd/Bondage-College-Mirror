import { Messager } from "@sugarch/bc-mod-utility";

export const messager = new Messager();

/**
 * @template {string} K
 */
class I18nMessage {
    /**
     * @param {Record<K, Translation.Entry>} messages
     */
    constructor(messages) {
        this.messages = messages;
    }

    /**
     * @param {K} key
     * @param  {SliceParameters<1, Messager["action"]>} args
     */
    action(key, ...args) {
        const lang = TranslationLanguage === "TW" ? "CN" : TranslationLanguage || "EN";
        const msg = this.messages[key][lang] || this.messages[key].EN;
        messager.action(msg, ...args);
    }
}

/**
 * @template {string} K
 * @param {Record<K, Translation.Entry>} messages
 */
export function makeI18nMessage(messages) {
    return new I18nMessage(messages);
}
