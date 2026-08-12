import { nodeIsHTML, translateNode } from "./utils/utils";

const translations = {
    "This padlock is recommended for those who want to feel really helpless, you will not be able to remove this padlock yourself. Continue? 😏":
        "这个锁推荐给那些想要感到真正无助的人，你将无法自己解开这个锁。继续吗？😏",
    "Yes, i want to lock myself": "是，我想锁住我自己",
    "No, i clicked wrong button": "不，我点错了按钮",
};

const translations2 = {
    "General": "常规",
    "Note": "备注",
    "Blocked Commands": "阻止聊天命令",
    "Access": "访问权限",
    "Submit": "提交修改",

    'Padlock can be managed only by users who <span style="color: #48AA6D;">correspond</span> to the <span style="color: #48AA6D;">access permissions</span><br><span style="color: #ff0000;">Protected from cheats</span>':
        '锁只能由<span style="color: #48AA6D;">符合</span> <span style="color: #48AA6D;">访问权限</span>的用户管理<br><span style="color: #ff0000;">防止作弊</span>',

    "When should the lock be removed? (Leave this field empty for permanent 😉)":
        "锁应该在什么时候被移除？（留空表示永久锁定😉）",

    "You can leave a note that other DOGS users can see": "你可以留个备注让其他DOGS用户看到",
    'You can paste commands which will be blocked for the padlock wearer. Example: "/command1, /command2"':
        '你可以粘贴将被锁佩戴者阻止的命令。例子："/command1, /command2"',

    "Member numbers which will always have access to the padlock": "将始终可以访问锁的成员编号",
    "Member numbers": "成员编号",

    "Everyone except wearer": "除了佩戴者的所有人",
    "Wearer's friends and higher": "佩戴者的好友及以上",
    "Wearer's whitelist and higher": "佩戴者的白名单及以上",
    "Wearer's family and higher": "佩戴者的家族及以上",
    "Wearer's lovers and higher": "佩戴者的恋人及以上",
    "Wearer's owner": "佩戴者的主人",
};

const prefixTranslation = {
    "Current access permission: ": "当前访问权限：",
    "Owner of the padlock: ": "锁的拥有者：",
};

function prefix(text) {
    for (const [key, value] of Object.entries(prefixTranslation)) {
        if (text.startsWith(key)) {
            return text.replace(key, value);
        }
    }
    return undefined;
}

const fullScreenTranslate = (text) => prefix(text) || translations2[text];

function setupTranslationObserver(node) {
    node.querySelectorAll("*").forEach((child) => translateNode(child, fullScreenTranslate));

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((addedNode) => {
                    if (nodeIsHTML(addedNode)) {
                        addedNode.querySelectorAll("*").forEach((child) => translateNode(child, fullScreenTranslate));
                        translateNode(addedNode, fullScreenTranslate);
                    }
                });
            }

            if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
                const parentEl = mutation.target.parentElement;
                if (parentEl) translateNode(parentEl, fullScreenTranslate);
            }
        }
    });

    observer.observe(node, {
        childList: true,
        subtree: true,
        characterData: true,
    });

    return observer;
}

/** @type {DOMObserverModifier[]} */
export const DOGS = [
    {
        filter: (node) => nodeIsHTML(node) && node.matches("#dogsPopupContainer"),
        action: (node) => {
            if (nodeIsHTML(node))
                node.querySelectorAll("*").forEach((child) => translateNode(child, (text) => translations[text]));
        },
    },
    {
        filter: (node) => nodeIsHTML(node) && node.matches("#dogsFullScreen"),
        action: (node) => {
            if (nodeIsHTML(node)) {
                setupTranslationObserver(node);
            }
        },
    },
];
