import { nodeIsHTML, translateNode } from "./utils/utils";

const translations = {
    Latex: "乳胶",
    ABDL: "成婴",
    Blindness: "失明",
    Bondage: "束缚",
    Chastity: "贞操带",
    Deafness: "失聪",
    Exhibitionist: "裸露",
    Forniphilia: "家具化",
    Gagged: "堵嘴",
    Leather: "皮质",
    Lingerie: "内衣",
    Masochism: "受虐",
    Metal: "金属",
    Nylon: "尼龙",
    Pet: "宠物",
    Pony: "小马",
    Rope: "绳索",
    Sadism: "虐待",
    Tape: "胶带",
};

/** @type {DOMObserverModifier} */
export const FetishShare = {
    filter: (node) => nodeIsHTML(node) && node.matches("#Menu_MBCFSFetishes-0"),
    action: (node) => {
        if (nodeIsHTML(node))
            node.querySelectorAll("*").forEach((child) => translateNode(child, (text) => translations[text]));
    },
};
