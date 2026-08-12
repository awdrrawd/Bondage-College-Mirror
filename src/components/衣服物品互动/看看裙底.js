import { PathTools } from "@sugarch/bc-mod-utility";
import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";
import { Path } from "../../resouce";

/** @type {CustomGroupName[]} */
const groups = ["Panties", "Panties_笨笨蛋Luzi"];

/** @type {(acted:Character) => Item | undefined} */
const queryItem = (acted) => {
    const chaste = acted.Appearance.find(
        (item) => item.Asset.Group.Name === "ItemPelvis" && InventoryItemHasEffect(item, "Chaste")
    );
    if (chaste) return chaste;
    return acted.Appearance.find((item) => groups.includes(item.Asset.Group.Name));
};

/** @type {CustomActivity[]} */
const activity = [
    {
        activity: {
            Name: "看看裙底",
            Prerequisite: [
                "Luzi_CanWalk",
                "Luzi_NotBlind",
                "Luzi_TargetPelvisExposed",
                Prereqs.ActedCheck((acted) => !!queryItem(acted)),
            ],
            MaxProgress: 0,
            Target: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
        },
        useImage: (_, acted) => {
            const item = queryItem(acted);
            if (item) return PathTools.assetPreviewIconPath(item);
        },
        item: (_, acted) => queryItem(acted),
        label: {
            CN: "看看裙底",
            EN: "Look under the skirt",
        },
        dialog: {
            CN: "SourceCharacter附下身看DestinationCharacter裙底，发现TargetCharacter穿着ActivityAsset.",
            EN: "SourceCharacter looks under DestinationCharacter skirt and finds that TargetCharacter is wearing ActivityAsset.",
        },
    },
    {
        activity: {
            Name: "看看裙底真空",
            Prerequisite: [
                "Luzi_CanWalk",
                "Luzi_NotBlind",
                "Luzi_TargetPelvisExposed",
                Prereqs.ActedCheck((acted) => !queryItem(acted)),
            ],
            MaxProgress: 40,
            Target: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
        },
        useImage: () => Path.resolve("activities/nopan.png"),
        label: {
            CN: "看看裙底",
            EN: "Look under the skirt",
        },
        dialog: {
            CN: "SourceCharacter附下身看DestinationCharacter裙底，发现TargetCharacter竟然没有穿内裤。",
            EN: "SourceCharacter looks under DestinationCharacter skirt and finds that TargetCharacter is not wearing any underwear.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivity(activity);
}
