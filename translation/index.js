import { setup as setupHtml } from "./html";
import { setup as setupBC } from "./bc";

/**
 * @param {HookManagerType} hook
 */
export function setupInvasiveTranslation(hook) {
    setupHtml();
    setupBC(hook);
}
