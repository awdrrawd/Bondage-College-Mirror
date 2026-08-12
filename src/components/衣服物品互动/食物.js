import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";
import { DynImageProviders } from "../../dynamicImage";
import { playerStomach } from "./foodValue";
import { Tools } from "@mod-utils/Tools";
import { PathTools } from "@sugarch/bc-mod-utility";

const stomachValueSetting = {
    棒棒糖: 0.1,
    烤鱼: 0.5,
    鸡腿: 0.6,
    煎包: 0.4,
    蛋糕卷: 0.8,
    吐司: 0.3,
    曲奇: 0.1,
    蛋挞: 0.2,
    月饼: 0.2,
};

function eat(assetName) {
    const value = stomachValueSetting[assetName];
    if (value) {
        playerStomach.eat(value);
    }
}

/** @type {CustomActivity[]} */
const activity = [
    {
        activity: {
            Name: `咬走食物_Luzi`,
            Prerequisite: [
                "UseMouth",
                Prereqs.Acting.GroupEmpty(["ItemMouth"]),
                Prereqs.any(
                    Prereqs.and(
                        (_1, _2, _3, group) => group.Name === "ItemMouth",
                        Prereqs.Acted.GroupIs("ItemMouth", Object.keys(stomachValueSetting))
                    ),
                    Prereqs.and(
                        (_1, _2, _3, group) => group.Name === "ItemHands",
                        Prereqs.Acted.GroupIs("ItemHandheld", Object.keys(stomachValueSetting))
                    )
                ),
            ],
            MaxProgress: 50,
            Target: ["ItemMouth", "ItemHands"],
        },
        useImage: (_, target, group) => {
            const groupName = group === "ItemMouth" ? "ItemMouth" : "ItemHandheld";
            const item = target.Appearance.find((item) => groupName === item.Asset.Group.Name);
            if (item) return PathTools.assetPreviewIconPath(item);
        },
        run: (player, sender, { SourceCharacter, TargetCharacter, ActivityGroup }) => {
            if (SourceCharacter === player.MemberNumber) {
                const groupName = ActivityGroup.Name === "ItemMouth" ? "ItemMouth" : "ItemHandheld";

                Tools.findCharacter("TargetC", TargetCharacter)
                    .then("TargetItem", (target) => InventoryGet(target, groupName))
                    .then((item) => InventoryWear(player, item.Asset.Name, "ItemMouth"))
                    .then((item, { TargetC, TargetItem }) => {
                        const Asset = item.Asset;
                        InventoryRemove(TargetC, groupName);
                        Object.assign(item, { ...TargetItem, Asset });
                        ChatRoomCharacterItemUpdate(TargetC, groupName);
                        ChatRoomCharacterUpdate(player);
                    });
            }
        },
        item: (_, acted, group) =>
            group.DynamicGroupName === "ItemMouth"
                ? InventoryGet(acted, "ItemMouth")
                : InventoryGet(acted, "ItemHandheld"),
        label: {
            CN: "咬走",
            EN: "Bite off",
        },
        dialog: {
            CN: {
                ItemMouth: "SourceCharacter从TargetCharacter嘴里咬走ActivityAsset.",
                ItemHands: "SourceCharacter从TargetCharacter手里咬走ActivityAsset.",
            },
            EN: {
                ItemMouth: "SourceCharacter bites off ActivityAsset from DestinationCharacter mouth.",
                ItemHands: "SourceCharacter bites off ActivityAsset from DestinationCharacter hand.",
            },
        },
    },
    {
        activity: {
            Name: `吃掉嘴里食物_Luzi`,
            Prerequisite: [
                "UseMouth",
                () => playerStomach.canEat(),
                Prereqs.not(Prereqs.Acting.GroupIs("动物身体_Luzi", ["幽灵人形"])), // 不允许幽灵人形吃东西
                Prereqs.Acting.GroupIs("ItemMouth", Object.keys(stomachValueSetting)),
            ],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemMouth"],
        },
        useImage: DynImageProviders.itemOnActedGroup("ItemMouth"),
        mode: "SelfOnSelf",
        run: (player) => {
            const item = InventoryGet(player, "ItemMouth");
            if (!item) return;
            eat(item.Asset.Name);
            InventoryRemove(player, "ItemMouth");
            ChatRoomCharacterItemUpdate(player, "ItemMouth");
        },
        item: (player) => InventoryGet(player, "ItemMouth"),
        label: {
            CN: "吃掉食物",
            EN: "Eat Food",
        },
        dialog: {
            CN: "SourceCharacter将塞在嘴里的ActivityAsset吃掉了.",
            EN: "SourceCharacter eats the ActivityAsset that was stuffed in the mouth.",
        },
    },
    {
        activity: {
            Name: `吃不下嘴里食物_Luzi`,
            Prerequisite: [
                "UseMouth",
                () => !playerStomach.canEat(),
                Prereqs.Acting.GroupIs("ItemMouth", Object.keys(stomachValueSetting)),
            ],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemMouth"],
        },
        useImage: DynImageProviders.itemOnActedGroup("ItemMouth"),
        item: (player) => InventoryGet(player, "ItemMouth"),
        label: {
            CN: "吃掉食物",
            EN: "Eat Food",
        },
        dialog: {
            CN: "SourceCharacter因为肚子太饱，吃不下嘴里的ActivityAsset.",
            EN: "SourceCharacter is too full to eat the ActivityAsset in the mouth.",
        },
    },
    {
        activity: {
            Name: `塞食物_Luzi`,
            Prerequisite: [
                Prereqs.Acted.GroupEmpty(["ItemMouth"]),
                Prereqs.Acting.GroupIs("ItemHandheld", Object.keys(stomachValueSetting)),
                (_1, acting, _2, _3) => {
                    const item = InventoryGet(acting, "ItemHandheld");
                    return !!AssetGet("Female3DCG", "ItemMouth", item.Asset.Name);
                },
            ],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHandheld"),
        run: (player, sender, { SourceCharacter, TargetCharacter, ActivityGroup }) => {
            if (SourceCharacter === player.MemberNumber) {
                Tools.findCharacter("TargetC", TargetCharacter)
                    .then("HeldItem", () => InventoryGet(player, "ItemHandheld"))
                    .then((item) => AssetGet("Female3DCG", "ItemMouth", item.Asset.Name))
                    .then((_, { TargetC, HeldItem }) => {
                        // 给棒棒糖
                        const nItem = InventoryWear(TargetC, HeldItem.Asset.Name, ActivityGroup.Name);

                        const Asset = nItem.Asset;
                        Object.assign(nItem, { ...HeldItem, Asset });

                        InventoryRemove(player, "ItemHandheld");

                        // 更新外观
                        ChatRoomCharacterUpdate(TargetC);
                        ChatRoomCharacterItemUpdate(player, "ItemHandheld");
                        CharacterRefresh(player, true);
                    });
            }
        },
        item: (actor) => InventoryGet(actor, "ItemHandheld"),
        label: {
            CN: "塞食物",
            EN: "Stuff with Food",
        },
        dialog: {
            CN: "SourceCharacter将手里的ActivityAsset塞进TargetCharacter的嘴里.",
            EN: "SourceCharacter stuffs DestinationCharacter mouth with ActivityAsset.",
        },
    },
    {
        activity: {
            Name: `用嘴喂食物`,
            Prerequisite: [
                "UseMouth",
                Prereqs.Acted.GroupEmpty(["ItemMouth"]),
                Prereqs.Acting.GroupIs("ItemMouth", Object.keys(stomachValueSetting)),
            ],
            MaxProgress: 50,
            Target: ["ItemMouth"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemMouth"),
        run: (player, sender, { SourceCharacter, TargetCharacter }) => {
            if (SourceCharacter === player.MemberNumber) {
                Tools.findCharacter("TargetC", TargetCharacter)
                    .then("MouthItem", () => InventoryGet(player, "ItemMouth"))
                    .then((item, { TargetC }) => InventoryWear(TargetC, item.Asset.Name, "ItemMouth"))
                    .then((item, { MouthItem }) => Object.assign(item, MouthItem))
                    .then((_, { TargetC }) => {
                        InventoryRemove(player, "ItemMouth");
                        ChatRoomCharacterUpdate(TargetC);
                        ChatRoomCharacterItemUpdate(player, "ItemMouth");
                    });
            }
        },
        item: () => InventoryGet(Player, "ItemMouth"),
        label: {
            CN: "用嘴喂食",
            EN: "Feed with Mouth",
        },
        dialog: {
            CN: "SourceCharacter用嘴将ActivityAsset喂到TargetCharacter嘴里。",
            EN: "SourceCharacter feeds ActivityAsset to TargetCharacter with mouth.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivity(activity);
}
