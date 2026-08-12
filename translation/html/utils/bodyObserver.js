class _HTMLBodyObserver {
    /** @type {DOMObserverModifier[]} */
    modifiers = [];
    constructor() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        // 遍历所有的 DOM 修改器
                        for (const modifier of this.modifiers) {
                            if (modifier.filter(node)) {
                                modifier.action(node);
                            }
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    /** @param {DOMObserverModifier | DOMObserverModifier[]} modifier */
    registerModifier(modifier) {
        if (Array.isArray(modifier)) {
            for (const mod of modifier) {
                this.modifiers.push(mod);
            }
        } else this.modifiers.push(modifier);
    }
}

export const HTMLBodyObserver = new _HTMLBodyObserver();
