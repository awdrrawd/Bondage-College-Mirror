import { Logger } from "@mod-utils/log";
import { ActivityManager } from "../activityForward";
import { Prereqs } from "../prereqs";

/** @type {Partial<Record<AssetGroupItemName, Record<string,number>>>} */
const chainLength = {
    ItemNeckRestraints: {
        CollarChainShort: 0,
        CollarChainMedium: 1,
        CollarChainLong: 2,
        CollarRopeShort: 0,
        CollarRopeMedium: 1,
        CollarRopeLong: 2,
        Post: 1,
        CollarLeash: 1,
        ChainLeash: 1,
        PetPost: 2,
        哥布哥布: 2,
        监控机器人: 1,
    },
    ItemMouth: {
        PonyGag: 1,
    },
};

const tailItems = ["TailStrap", "KittenTailStrap2", "KittenTailStrap1", "穿戴式浅色猫尾镜像", "小型穿戴式软猫尾镜像"];

/** @type { Record<Exclude<CustomActivityPrerequisite,ActivityPrerequisite>, PrerequisiteCheckFunction> }  */
const prereqStorage = {
    Luzi_HasTail: (_prereq, acting, _acted, _group) => !!InventoryGet(acting, "TailStraps"),
    Luzi_TargetHasTail: (_prereq, _acting, acted, _group) => !!InventoryGet(acted, "TailStraps"),
    Luzi_HasWings: (_prereq, acting, _acted, _group) => !!InventoryGet(acting, "Wings"),
    Luzi_TargetHasWings: (_prereq, _acting, acted, _group) => !!InventoryGet(acted, "Wings"),
    Luzi_TargetCanBeLeashed: (_prereq, _acting, acted, _group) => ChatRoomCanBeLeashed(acted),
    Luzi_TargetLeashedOrCanBeLeashed: (_prereq, _acting, acted, _group) =>
        ChatRoomLeashList.includes(acted.MemberNumber) || ChatRoomCanBeLeashed(acted),
    Luzi_IsLeashingTarget: (_prereq, acting, acted, _group) => {
        if (!acting.IsPlayer()) return false;
        return ChatRoomLeashList.includes(acted.MemberNumber);
    },
    Luzi_HasCatTail: Prereqs.Acting.GroupIs("TailStraps", tailItems),
    Luzi_TargetHasCatTail: Prereqs.Acted.GroupIs("TailStraps", tailItems),
    Luzi_TargetHasTentacles: Prereqs.any(
        Prereqs.Acted.GroupIs("TailStraps", ["Tentacles"]),
        Prereqs.Acted.GroupIs("ItemButt", ["Tentacles"])
    ),
    Luzi_ActedZoneNaked: (_prereq, _acting, acted, _group) => {
        switch (_group.Name) {
            case "ItemBreast":
            case "ItemNipples":
                return !InventoryPrerequisiteMessage(acted, "AccessBreast") && !acted.IsBreastChaste();
            case "ItemButt":
                return !InventoryPrerequisiteMessage(acted, "AccessButt") && !acted.IsButtChaste();
            case "ItemVulva":
                return !InventoryPrerequisiteMessage(acted, "AccessVulva") && !acted.IsVulvaChaste();
            case "ItemVulvaPiercings":
                return !InventoryPrerequisiteMessage(acted, "AccessVulva") && !acted.IsVulvaChaste();
            case "ItemHands":
                return !acted.Appearance.some((i) => InventoryItemHasEffect(i, "MergedFingers"));
        }
        Logger.warn(`Luzi_ActedZoneNaked cannot be used with group: ${_group.Name}`);
        return true;
    },
    Luzi_HasTentacles: Prereqs.any(
        Prereqs.Acting.GroupIs("TailStraps", ["Tentacles"]),
        Prereqs.Acting.GroupIs("ItemButt", ["Tentacles"])
    ),
    Luzi_HasPawMittens: (_prereq, acting, _acted, _group) =>
        InventoryIsItemInList(acting, "ItemHands", ["PawMittens", "ElbowLengthMittens"]),
    Luzi_TargetHasPawMittens: (_prereq, _acting, acted, _group) =>
        InventoryIsItemInList(acted, "ItemHands", ["PawMittens", "ElbowLengthMittens"]),
    Luzi_HasPetSuit: Prereqs.any(
        Prereqs.Acting.GroupIs("ItemArms", ["ShinyPetSuit", "BitchSuit", "StrictLeatherPetCrawler", "乳胶宠物拘束服"]),
        Prereqs.and(
            Prereqs.Acting.GroupIs("ItemArms", ["宠物服上", "PawPaddedPetsuitArms", "StrappedPetsuitArms"]),
            Prereqs.Acting.GroupIs("ItemLegs", ["宠物服下", "PawPaddedPetsuitLegs", "StrappedPetsuitLegs"])
        )
    ),
    Luzi_HasBreast: Prereqs.Acting.GroupIs("BodyUpper", ["Small", "Normal", "Large", "XLarge"]),
    Luzi_TargetHasBreast: Prereqs.Acted.GroupIs("BodyUpper", ["Small", "Normal", "Large", "XLarge"]),
    Luzi_HasKennel: (_prereq, _acting, acted, _group) => InventoryIsItemInList(acted, "ItemDevices", ["Kennel"]),
    Luzi_TargetHasItemVulvaPiercings: (_prereq, _acting, acted, _group) => {
        const item = InventoryGet(acted, "ItemVulvaPiercings");
        if (!item) return false;
        return [
            "StraightClitPiercing",
            "RoundClitPiercing",
            "BarbellClitPiercing",
            "ChastityClitPiercing",
            "JewelClitPiercing",
            "AdornedClitPiercing",
            "VibeHeartClitPiercing",
            "ClitRing",
        ].includes(item.Asset.Name);
    },
    Luzi_TargetHasItemVulva: (_prereq, _acting, acted, _group) => !!InventoryGet(acted, "ItemVulva"),
    Luzi_HasSword: (_prereq, acting, _acted, _group) => {
        const item = InventoryGet(acting, "ItemHandheld");
        if (!item) return false;
        if (item.Asset.Name === "Sword") return true;
        if (item.Asset.Name === "分层剑") return true;
        if (
            item.Asset.Name === "武器组合" &&
            item.Property?.TypeRecord?.["t"] === 1 &&
            item.Property?.TypeRecord?.["s"] === 1
        )
            return true;
        if (item.Asset.Name === "刀" && item.Property?.TypeRecord?.["A"] === 1) return true;
        return false;
    },
    Luzi_Has鱼鱼尾: Prereqs.Acting.GroupIs("动物身体_Luzi", ["鱼鱼尾"]),
    Luzi_CharacterViewWithinReach: (_prereq, acting, acted, _group) => {
        if (!ServerPlayerIsInChatRoom()) return false;
        if (!ChatRoomCharacterViewIsActive()) return true;
        if (acting.CanWalk()) return true;
        if (acting.IsMounted()) return false;

        const actedIdx = ChatRoomCharacter.findIndex((C) => C.MemberNumber === acted.MemberNumber);
        const actingIdx = ChatRoomCharacter.findIndex((C) => C.MemberNumber === acting.MemberNumber);
        if (actedIdx < 0 || actingIdx < 0) return false;
        const idxDiff = Math.abs(actedIdx - actingIdx);

        for (const item of acting.Appearance) {
            if (item.Asset.Group.Name in chainLength) {
                const chain = chainLength[item.Asset.Group.Name][item.Asset.Name];
                if (chain !== undefined) {
                    if (idxDiff > chain) return false;
                }
            }
        }

        return true;
    },
    Luzi_Female: Prereqs.ActingCheck((acting) => !acting.HasPenis()),
    Luzi_TargetFemale: Prereqs.ActedCheck((acted) => !acted.HasPenis()),
    Luzi_CanWalk: (_prereq, acting, _acted, _group) => acting.CanWalk(),
    Luzi_IsStanding: Prereqs.Acting.PoseIsStanding(),
    Luzi_IsKneeling: Prereqs.Acting.PoseIsKneeling(),
    Luzi_IsAllFours: Prereqs.Acting.PoseIs("BodyFull", "AllFours"),
    Luzi_TargetAllFours: Prereqs.Acted.PoseIs("BodyFull", "AllFours"),
    Luzi_KneelOrAllFours: Prereqs.or(Prereqs.Acting.PoseIsKneeling(), Prereqs.Acting.PoseIsAllFours()),
    Luzi_TargetKneelOrAllFours: Prereqs.or(Prereqs.Acted.PoseIsKneeling(), Prereqs.Acted.PoseIsAllFours()),
    Luzi_LeashedBy: (_prereq, acting, acted, _group) => {
        if (!acting.IsPlayer()) return false;
        return ChatRoomLeashPlayer && ChatRoomLeashPlayer === acted.MemberNumber;
    },
    Luzi_NotBlind: (_prereq, acting, _acted, _group) => !acting.IsBlind(),
    Luzi_TargetPelvisExposed: Prereqs.ActedCheck(
        (acted) =>
            !InventoryDoItemsBlockGroup(acted, "ItemPelvis", ["Cloth", "ClothLower"]) &&
            InventoryDoItemsExposeGroup(acted, "ItemVulva", ["ClothLower"])
    ),
    Luzi_PrivateExposed: Prereqs.ActingCheck(
        (acting) => !InventoryPrerequisiteMessage(acting, "AccessVulva") && !acting.IsVulvaChaste()
    ),
    Luzi_HasPenis: Prereqs.ActingCheck((acting) => acting.HasPenis()),
};

export default function () {
    /** @type {CustomActivityPrerequisiteItem[]} */
    const prereqs = [];
    for (const [k, test] of Object.entries(prereqStorage)) {
        prereqs.push({
            name: /** @type {CustomActivityPrerequisite}*/ (k),
            test,
        });
    }
    ActivityManager.addPrerequisites(prereqs);
}
