import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";
import { ActivityExt } from "../../activityext";

/**@type {Partial<Record<AssetGroupItemName, CustomGroupName[]>>} */
const groupMap = {
    ItemTorso: ["Cloth", "Cloth_笨笨蛋Luzi", "Cloth_笨笨笨蛋Luzi2", "Suit", "Suit_笨笨蛋Luzi"],
    ItemLegs: ["ClothLower", "ClothLower_笨笨蛋Luzi", "ClothLower_笨笨笨蛋Luzi2", "SuitLower", "SuitLower_笨笨蛋Luzi"],
    ItemBreast: [
        "Bra",
        "Bra_笨笨蛋Luzi",
        "ClothAccessory",
        "ClothAccessory_笨笨蛋Luzi",
        "ClothAccessory_笨笨笨蛋Luzi2",
        "Corset",
    ],
    ItemVulvaPiercings: ["Panties", "Panties_笨笨蛋Luzi"],
    ItemFeet: ["Socks", "SocksLeft", "SocksRight"],
    ItemBoots: ["Shoes", "Shoes_笨笨蛋Luzi"],
    ItemHead: ["Hat", "Hat_笨笨蛋Luzi"],
    ItemMouth: ["Mask", "Mask_笨笨蛋Luzi"],
    ItemArms: ["Gloves", "Gloves_笨笨蛋Luzi"],
};

/** @type { CustomActivity[] } */
const activity = ActivityExt.fromTemplateActivity(
    [
        {
            activity: {
                Name: "剪刀剪掉上衣",
                Prerequisite: [
                    "UseHands",
                    "UseArms",
                    Prereqs.Acting.GroupIs("ItemHandheld", "Scissors"),
                    (_1, _2, acted, group) => {
                        const gSet = new Set(acted.Appearance.map((a) => a.Asset.Group.Name));
                        return groupMap[group.Name]?.some((g) => gSet.has(g));
                    },
                ],
                MaxProgress: 50,
                Target: /** @type {AssetGroupItemName[]} */ (Object.keys(groupMap)),
                TargetSelf: true,
            },
            useImage: ["ItemHandheld", "Scissors"],
            mode: "AnyOnSelf",
            run: (player, sender, info) => {
                // 遵守物品权限
                if (!ServerChatRoomGetAllowItem(sender, player)) return;

                // 使用动作拓展才会被剪衣服，可以只处理收到消息的情况
                const groups = groupMap[info.ActivityGroup.Name];
                if (groups) {
                    player.Appearance = player.Appearance.filter((i) => !groups.includes(i.Asset.Group.Name));
                    ChatRoomCharacterUpdate(player);
                }
            },
        },
    ],
    {
        CN: {
            ItemTorso: "上衣",
            ItemLegs: "下衣",
            ItemBreast: "胸罩",
            ItemVulvaPiercings: "内裤",
            ItemFeet: "袜子",
            ItemBoots: "鞋子",
            ItemHead: "帽子",
            ItemMouth: "面具",
            ItemArms: "手套",
        },
        EN: {
            ItemTorso: "Top",
            ItemLegs: "Bottom",
            ItemBreast: "Bra",
            ItemVulvaPiercings: "Underwear",
            ItemFeet: "Socks",
            ItemBoots: "Shoes",
            ItemHead: "Hat",
            ItemMouth: "Mask",
            ItemArms: "Gloves",
        },
        UA: {
            ItemTorso: "Верхній одяг",
            ItemLegs: "Нижній одяг",
            ItemBreast: "Ліфчик",
            ItemVulvaPiercings: "Трусики",
            ItemFeet: "Шкарпетки",
            ItemBoots: "Взуття",
            ItemHead: "Шапка",
            ItemMouth: "Маска",
            ItemArms: "Рукавички",
        },
    },
    {
        label: {
            CN: "剪刀剪掉$group",
            EN: "Scissors Cut the $group",
            UA: "Відрізати $group ножицями",
        },
        dialog: {
            CN: "SourceCharacter用剪刀剪掉了DestinationCharacter$group。",
            EN: "SourceCharacter Cuts Off DestinationCharacter $group with Scissors.",
            UA: "SourceCharacter ріже $group TargetCharacter ножицями.",
        },
    }
);

export default function () {
    ActivityManager.addCustomActivity(activity);
}
