import { ActivityManager } from "../../activityForward";
import { DynImageProviders } from "../../dynamicImage";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "剑架在脖子上",
            Prerequisite: ["UseHands", "UseArms", "Luzi_HasSword"],
            MaxProgress: 50,
            Target: ["ItemNeck", "ItemNeckRestraints", "ItemNeckAccessories"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHandheld"),
        item: (actor) => InventoryGet(actor, "ItemHandheld"),
        label: {
            CN: "剑架在脖子上",
            EN: "Sword Rests on the Neck",
        },
        dialog: {
            CN: "SourceCharacter把ActivityAsset架在DestinationCharacter脖子上.",
            EN: "SourceCharacter places the ActivityAsset on DestinationCharacter neck.",
        },
    },
    {
        activity: {
            Name: "剑拍脸",
            Prerequisite: ["UseHands", "UseArms", "Luzi_HasSword"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHandheld"),
        item: (actor) => InventoryGet(actor, "ItemHandheld"),
        label: {
            CN: "剑拍脸",
            EN: "Sword Slaps the Face",
        },
        dialog: {
            CN: "SourceCharacter用ActivityAsset的侧面轻轻拍了拍DestinationCharacter脸。",
            EN: "SourceCharacter gently slaps DestinationCharacter face with the side of the ActivityAsset.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
