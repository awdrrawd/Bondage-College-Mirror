import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";
import { monadic } from "@mod-utils/monadic";

/** @param {Character} target */
function findPlushie(target) {
    return monadic(
        "Item",
        target.Appearance.find((item) => item.Asset.Name === "玩偶")
    )
        .then((item) => item.Property.TypeRecord)
        .then("Type", (tr) => Object.entries(tr).find(([_, value]) => Boolean(value)));
}

/** @param {Character} target */
const findPlushieImage = (target) =>
    findPlushie(target)
        .then(([key, value], { Item }) =>
            Item.Asset.Layer.find((l) => l.AllowTypes.AllTypes[key] && l.AllowTypes.AllTypes[key].has(value))
        )
        .then((l, { Item }) => `Assets/Female3DCG/${Item.Asset.DynamicGroupName}/${Item.Asset.Name}_${l.Name}.png`);

/** @param {Character} target */
const findPlushieText = (target) =>
    findPlushie(target).then(
        ([key, value], { Item }) =>
            Item.Craft?.Name ?? AssetTextGet(`${Item.Asset.DynamicGroupName}${Item.Asset.Name}Option${key}${value}`)
    );

/** @type {Pick<CustomActivity,"useImage" | "item" | "dictionary">} */
const useMyPlushie = {
    useImage: () => findPlushieImage(Player).valueOr(() => null),
    item: (actor) => actor.Appearance.find((item) => item.Asset.Name === "玩偶"),
    dictionary: (prev, actor) =>
        findPlushieText(actor)
            .then((text) => [...prev, { Tag: "ActivityPlushieAsset", Text: text }])
            .valueOr(() => prev),
};

/** @type {Pick<CustomActivity,"useImage" | "item" | "dictionary">} */
const useTheirPlushie = {
    useImage: (_, target) => findPlushieImage(target).valueOr(() => null),
    item: (_, acted) => acted.Appearance.find((item) => item.Asset.Name === "玩偶"),
    dictionary: (prev, _, acted) =>
        findPlushieText(acted)
            .then((text) => [...prev, { Tag: "ActivityPlushieAsset", Text: text }])
            .valueOr(() => prev),
};

const hasPlushie = Prereqs.ActingCheck((acting) => acting.Appearance.some((item) => item.Asset.Name === "玩偶"));
const theyHavePlushie = Prereqs.ActedCheck((acted) => acted.Appearance.some((item) => item.Asset.Name === "玩偶"));

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "玩偶蹭脸",
            Prerequisite: ["UseHands", "UseArms", hasPlushie],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemHands"],
        },
        ...useMyPlushie,
        label: { CN: "脸蹭玩偶", EN: "Face Rubs the Doll" },
        dialog: {
            CN: "SourceCharacter用脸轻轻蹭了蹭自己手中的ActivityPlushieAsset玩偶。",
            EN: "SourceCharacter gently rubs PronounPossessive face with the ActivityPlushieAsset plushie in PronounPossessive hand.",
        },
    },
    {
        activity: {
            Name: "玩偶拍头",
            Prerequisite: ["UseHands", "UseArms", hasPlushie],
            MaxProgress: 0,
            Target: ["ItemHead"],
            TargetSelf: true,
        },
        ...useMyPlushie,
        label: { CN: "玩偶摸头", EN: "Plushie Headpat" },
        dialog: {
            CN: "SourceCharacter用自己手中的ActivityPlushieAsset玩偶轻轻拍了拍DestinationCharacter头。",
            EN: "SourceCharacter gently pats DestinationCharacter head with the ActivityPlushieAsset plushie in PronounPossessive hand.",
        },
    },
    {
        activity: {
            Name: "玩偶戳戳",
            Prerequisite: ["UseHands", "UseArms", theyHavePlushie],
            MaxProgress: 0,
            Target: ["ItemHands"],
            TargetSelf: true,
        },
        ...useTheirPlushie,
        label: { CN: "玩偶戳戳", EN: "Plushie Poke" },
        dialog: {
            CN: "SourceCharacter轻轻戳了戳DestinationCharacter手中ActivityPlushieAsset玩偶的脸。",
            EN: "SourceCharacter gently pokes the face of the ActivityPlushieAsset plushie held by DestinationCharacter",
        },
    },
    {
        activity: {
            Name: "玩偶蹭蹭",
            Prerequisite: ["UseHands", "UseArms", theyHavePlushie, hasPlushie],
            MaxProgress: 0,
            Target: ["ItemHands"],
        },
        ...useTheirPlushie,
        label: { CN: "玩偶蹭蹭", EN: "Plushie Rubs" },
        dialog: {
            CN: "SourceCharacter用PronounPossessiveActivityPlushieAssetMine玩偶蹭了蹭DestinationCharacterActivityPlushieAssetTheirs玩偶。",
            EN: "SourceCharacter rubs DestinationCharacter ActivityPlushieAssetMine plushie with PronounPossessive ActivityPlushieAssetTheirs plushie.",
        },
        dictionary: (prev, actor, acted) => {
            const mine = findPlushieText(actor).valueOr(() => null);
            const their = findPlushieText(acted).valueOr(() => null);
            if (mine && their) {
                return [
                    ...prev,
                    { Tag: "ActivityPlushieAssetMine", Text: mine },
                    { Tag: "ActivityPlushieAssetTheirs", Text: their },
                ];
            }
            return prev;
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
