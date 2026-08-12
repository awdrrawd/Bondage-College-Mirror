import { monadic } from "@mod-utils/monadic";
import { ActivityManager } from "../../activityForward";
import { ActivityExt } from "../../activityext";
import { playerStomach } from "./foodValue";

/** @type {Partial<Record<AssetGroupItemName, string[]>>} */
const splatterLocation = {
    ItemHead: ["a", "b", "c"],
    ItemMouth: ["d", "e", "f", "o"],
    ItemBreast: ["g", "h", "i", "j"],
    ItemPelvis: ["k", "l", "m", "n"],
    ItemVulva: ["p"],
    ItemButt: ["q"],
    ItemNipples: ["r"],
};

/**
 * @param {Character} chara
 * @param {AssetGroupName} group
 */
const locateSplatter = (chara, group) => {
    const rTypes = splatterLocation[group];
    if (!rTypes) return [];

    const items = chara.Appearance.filter((a) => a.Asset.Name === "Splatters");
    if (items.length === 0) return [];

    return items.filter(
        (item) => item.Property?.TypeRecord && rTypes.some((type) => item.Property.TypeRecord[type] === 1)
    );
};

/** @type {PrerequisiteCheckFunction} */
const checkTargetSplatter = (_, _acting, acted, group) => locateSplatter(acted, group.Name).length > 0;

/** @type {CustomActivity} */
const activity = ActivityExt.fromTemplateActivity(
    {
        activity: {
            Name: `舔液体`,
            Prerequisite: ["UseTongue", () => playerStomach.canEat(), checkTargetSplatter],
            MaxProgress: 50,
            Target: /** @type {AssetGroupItemName[]}*/ (Object.keys(splatterLocation)),
        },
        useImage: "Lick",
        run: (player, sender, { SourceCharacter, TargetCharacter, ActivityGroup }) => {
            if (TargetCharacter === player.MemberNumber) {
                if (!ServerChatRoomGetAllowItem(sender, player)) return;
                monadic("rTypes", splatterLocation[ActivityGroup.Name])
                    .then("item", () => locateSplatter(player, ActivityGroup.Name)[0])
                    .then((item) => item.Property?.TypeRecord)
                    .then((oldTR, { rTypes, item }) => {
                        const newTR = { ...oldTR };
                        for (const type of rTypes) {
                            if (newTR[type] === 1) {
                                newTR[type] = 0;
                                break;
                            }
                        }
                        ExtendedItemSetOptionByRecord(Player, item, newTR);
                        ChatRoomCharacterUpdate(player);
                    });
            } else if (SourceCharacter === player.MemberNumber) {
                playerStomach.eat(0.05);
            }
        },
    },
    {
        CN: {
            ItemHead: "额头",
            ItemMouth: "脸",
            ItemBreast: "胸口",
            ItemPelvis: "腹部",
            ItemVulva: "阴部",
            ItemButt: "臀部",
            ItemNipples: "乳头",
        },
        EN: {
            ItemHead: "Forehead",
            ItemMouth: "Face",
            ItemBreast: "Chest",
            ItemPelvis: "Tummy",
            ItemVulva: "Vulva",
            ItemButt: "Butt",
            ItemNipples: "Nipples",
        },
    },
    {
        label: {
            CN: "舔掉$group上的液体",
            EN: "Lick off liquid on $group",
        },
        dialog: {
            CN: "SourceCharacter舔掉了一些DestinationCharacter$group上的液体.",
            EN: "SourceCharacter licked off some liquid on DestinationCharacter $group.",
        },
    }
);

export default function () {
    ActivityManager.addCustomActivity(activity);
}
