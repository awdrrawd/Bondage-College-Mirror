import { DOGS } from "./DOGS";
import { BCAR } from "./BCAR";
import { EBCH } from "./EBCH";
import { BCX } from "./BCX";
import { LSCG } from "./LSCG";
import { BCTweaks } from "./BCTweaks";
import { FetishShare } from "./FetishShare";

/** @type {TranslationUnit[]} */
const translationUnits = [BCX, LSCG, BCAR, BCTweaks, DOGS, EBCH, FetishShare];

function shouldTranslate() {
    return ["CN", "TW"].includes(TranslationLanguage);
}

/**
 * @template T
 * @param {string} key
 * @param {(arg:string)=>T} callback
 */
function translateMenuText(key, callback) {
    for (const { translateMenuText } of translationUnits) {
        const translated = translateMenuText?.(key);
        if (translated) return callback(translated);
    }
}

/**
 * @template T
 * @param {string} key
 * @param {(arg:string)=>T} callback
 */
function translateActivityText(key, callback) {
    for (const { translateActivityText } of translationUnits) {
        const translated = translateActivityText?.(key);
        if (translated) return callback(translated);
    }
}

/**
 * @template T
 * @param {string} key
 * @param {(arg:string)=>T} callback
 */
function translateLocalMessage(key, callback) {
    for (const { translateLocalMessage } of translationUnits) {
        const translated = translateLocalMessage?.(key);
        if (translated) return callback(translated);
    }
}

/**
 * @param {HookManagerType} hook
 */
export function setup(hook) {
    const insideDrawCharaApp = hook.insideFlag("CommonDrawAppearanceBuild");
    const insideDrawCharacter = hook.insideFlag("DrawCharacter");
    const inside = () => insideDrawCharaApp.inside || insideDrawCharacter.inside;

    ["DrawText", "DrawTextFit", "DrawTextWrap", "DynamicDrawText"].forEach((name) => {
        hook.hookFunction(name, 10, (args, next) => {
            const _args = /** @type {[string, ...n:any[]]} */ (args);
            if (!inside() && shouldTranslate() && args[0]) translateMenuText(_args[0], (text) => (_args[0] = text));
            return next(args);
        });
    });

    hook.hookFunction("ActivityDictionaryText", 1, (args, next) => {
        let ret = next(args);
        if (shouldTranslate()) translateActivityText(ret, (text) => (ret = text));
        return ret;
    });

    hook.hookFunction("ChatRoomSendLocal", 0, (args, next) => {
        if (shouldTranslate()) {
            translateLocalMessage(args[0], (text) => (args[0] = text));
        }
        return next(args);
    });

    hook.hookFunction("ChatRoomMessage", 0, (args, next) => {
        const { Content, Type, Dictionary } = args[0];
        if (shouldTranslate() && ["Action", "Activity"].includes(Type) && Content && Dictionary) {
            const targetTag = (() => {
                if (Type === "Action") {
                    if (Content === "Beep") return "msg";
                    return `MISSING TEXT IN "Interface.csv": ${Content}`;
                } else if (Type === "Activity") {
                    return `MISSING TEXT IN "ActivityDictionary.csv": ${Content}`;
                }
                return undefined;
            })();

            const target = /** @type {TextDictionaryEntry | undefined}*/ (
                Dictionary.find((item) => /** @type {any} */ (item)?.Tag === targetTag)
            );

            if (target) {
                translateActivityText(target.Text, (translated) => (target.Text = translated));

                if (Content === "Beep") {
                    // NOTE: BCAR+ deliberately remove this tag to prevent CN support
                    if (!Dictionary.find((item) => /** @type {any} */ (item)?.Tag === "(发送私聊)")) {
                        Dictionary.push({
                            Tag: "(发送私聊)",
                            Text: "msg",
                        });
                    }
                }
            }
        }

        next(args);
    });
}
