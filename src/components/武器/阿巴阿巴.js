import { Path, playItemAudio } from "../../resouce";
import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";
import { ActivityExt } from "../../activityext";

const regionTexts = {
    CN: {
        ItemBreast: "乳房",
        ItemButt: "屁股",
        ItemMouth: "脸",
        ItemTorso: "腰",
        ItemEars: "耳朵",
        ItemArms: "手臂",
        ItemNeck: "脖子",
        ItemHood: "头",
        ItemHead: "眉心",
        ItemNose: "鼻子",
        ItemPelvis: "肚子",
        ItemHands: "手",
        ItemLegs: "大腿",
        ItemFeet: "小腿",
        ItemBoots: "脚",
    },
    EN: {
        ItemBreast: "Breast",
        ItemButt: "Butt",
        ItemMouth: "Mouth",
        ItemTorso: "Torso",
        ItemEars: "Ears",
        ItemArms: "Arms",
        ItemNeck: "Neck",
        ItemHood: "Hood",
        ItemHead: "Head",
        ItemNose: "Nose",
        ItemPelvis: "Abdomen",
        ItemHands: "Hands",
        ItemLegs: "Thighs",
        ItemFeet: "Calves",
        ItemBoots: "Feet",
    },
};

const regions = /** @type {AssetGroupItemName[]} */ (Object.keys(regionTexts.CN));

/** @type { CustomActivity[] } */
const activity = [
    ActivityExt.fromTemplateActivity(
        {
            activity: {
                Name: "阿巴阿巴",
                Prerequisite: ["UseArms", "UseHands", Prereqs.Acting.GroupIs("ItemHandheld", ["阿巴阿巴"])],
                MaxProgress: 50,
                Target: regions,
                TargetSelf: true,
            },
            mode: "AnyInvolved",
            run: (player, _, { SourceCharacter, TargetCharacter }) =>
                playItemAudio(
                    Path.resolve(`audio/gelgun${Math.floor(Math.random() * 4) + 1}.mp3`),
                    SourceCharacter === player.MemberNumber || TargetCharacter === player.MemberNumber
                ),
            useImage: ["ItemHandheld", "阿巴阿巴"],
            item: (actor) => InventoryGet(actor, "ItemHandheld"),
        },
        regionTexts,
        {
            label: {
                CN: "射击$group",
                EN: "Shoot $group",
            },
            dialog: {
                CN: "SourceCharacter举起ActivityAsset瞄准, 水弹直直击中了DestinationCharacter$group。",
                EN: "SourceCharacter raised the ActivityAsset and aimed, the gel bullet hit DestinationCharacter $group directly.",
            },
        }
    ),
    ActivityExt.fromTemplateActivity(
        {
            activity: {
                Name: "阿巴阿巴_瞄准",
                Prerequisite: ["UseArms", "UseHands", Prereqs.Acting.GroupIs("ItemHandheld", ["阿巴阿巴"])],
                MaxProgress: 50,
                Target: regions,
            },
            mode: "AnyInvolved",
            useImage: ["ItemHandheld", "阿巴阿巴"],
            item: (actor) => InventoryGet(actor, "ItemHandheld"),
        },
        regionTexts,
        {
            label: {
                CN: "瞄准$group",
                EN: "Aim at $group",
            },
            dialog: {
                CN: "SourceCharacter举起ActivityAsset，瞄准了DestinationCharacter$group。",
                EN: "SourceCharacter raised the ActivityAsset and aimed at DestinationCharacter $group.",
            },
        }
    ),
];

export default function () {
    ActivityManager.addCustomActivity(activity);
}
