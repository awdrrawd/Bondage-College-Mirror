import { ActivityManager } from "../../activityForward";
import { DynImageProviders } from "../../dynamicImage";
import { createActivityStateCtrl } from "../../lib/statedActivity";
import { Prereqs } from "../../prereqs";

const vpiercingState = createActivityStateCtrl();

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "钩住阴蒂环",
            Prerequisite: [
                "UseHands",
                "Luzi_TargetHasItemVulvaPiercings",
                "Luzi_TargetPelvisExposed",
                Prereqs.ActedCheck(
                    (acted) =>
                        !vpiercingState.isActive() ||
                        vpiercingState.check((state) => state.target !== acted.MemberNumber)
                ),
            ],
            MaxProgress: 100,
            Target: ["ItemVulvaPiercings"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActedGroup("ItemVulvaPiercings"),
        item: (_, acted) => InventoryGet(acted, "ItemVulvaPiercings"),
        label: {
            CN: "勾弄阴蒂环",
            EN: "Hook Clitoral Ring",
        },
        dialog: {
            CN: "SourceCharacter 用手指轻轻勾住了 DestinationCharacter ActivityAsset。",
            EN: "SourceCharacter hooks a finger around DestinationCharacter ActivityAsset.",
        },
        run: (player, sender, { SourceCharacterC, TargetCharacter }) => {
            if (SourceCharacterC.IsPlayer()) {
                vpiercingState.update(TargetCharacter);
            }
        },
    },
    {
        activity: {
            Name: "用手观察阴蒂环",
            Prerequisite: [
                "Luzi_NotBlind",
                "UseHands",
                "Luzi_TargetHasItemVulvaPiercings",
                "Luzi_TargetPelvisExposed",
                Prereqs.ActedCheck((acted) => vpiercingState.check((state) => state.target === acted.MemberNumber)),
            ],
            MaxProgress: 60,
            Target: ["ItemVulvaPiercings"],
        },
        useImage: DynImageProviders.itemOnActedGroup("ItemVulvaPiercings"),
        item: (_, acted) => InventoryGet(acted, "ItemVulvaPiercings"),
        label: {
            CN: "检视阴蒂环",
            EN: "Inspect Piercing",
        },
        dialog: {
            CN: "SourceCharacter 用指尖轻轻托起 DestinationCharacter ActivityAsset，仔细端详着做工和光泽。",
            EN: "SourceCharacter gently lifts DestinationCharacter ActivityAsset with fingertips, carefully examining its craftsmanship and luster.",
        },
        run: (player, sender, { SourceCharacterC }) => {
            if (SourceCharacterC.IsPlayer()) {
                vpiercingState.update();
            }
        },
    },
    {
        activity: {
            Name: "拨弄阴蒂环",
            Prerequisite: [
                "UseHands",
                "Luzi_TargetHasItemVulvaPiercings",
                "Luzi_TargetPelvisExposed",
                Prereqs.ActedCheck((acted) => vpiercingState.check((state) => state.target === acted.MemberNumber)),
            ],
            MaxProgress: 100,
            Target: ["ItemVulvaPiercings"],
        },
        useImage: DynImageProviders.itemOnActedGroup("ItemVulvaPiercings"),
        item: (_, acted) => InventoryGet(acted, "ItemVulvaPiercings"),
        label: {
            CN: "把玩阴蒂环",
            EN: "Toy with Piercing",
        },
        dialog: {
            CN: "SourceCharacter 用手指缓缓转动 DestinationCharacter ActivityAsset，观察对方的反应。",
            EN: "SourceCharacter slowly rotates DestinationCharacter ActivityAsset with fingers, observing the partner's reaction.",
        },
        run: (player, sender, { SourceCharacterC }) => {
            if (SourceCharacterC.IsPlayer()) {
                vpiercingState.update();
            }
        },
    },
    {
        activity: {
            Name: "拉扯阴蒂环",
            Prerequisite: [
                "UseHands",
                "Luzi_TargetHasItemVulvaPiercings",
                "Luzi_TargetPelvisExposed",
                Prereqs.ActedCheck((acted) => vpiercingState.check((state) => state.target === acted.MemberNumber)),
            ],
            MaxProgress: 100,
            Target: ["ItemVulvaPiercings"],
        },
        useImage: DynImageProviders.itemOnActedGroup("ItemVulvaPiercings"),
        item: (_, acted) => InventoryGet(acted, "ItemVulvaPiercings"),
        label: {
            CN: "轻拉穿环",
            EN: "Tug Piercing",
        },
        dialog: {
            CN: "SourceCharacter 用手指轻轻拉扯 TargetCharacter 的阴蒂环，金属的凉意和轻微的拉力形成奇妙的触感。",
            EN: "SourceCharacter gives a gentle tug to the piercing, creating a peculiar sensation between the cool metal and slight tension.",
        },
        run: (player, sender, { SourceCharacterC }) => {
            if (SourceCharacterC.IsPlayer()) {
                vpiercingState.update();
            }
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
