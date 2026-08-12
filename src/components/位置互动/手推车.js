import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";
import { DrawMods, SharedCenterModifier } from "@mod-utils/ChatRoomOrder";
import { DynImageProviders } from "../../dynamicImage";
import { ChatRoomOrderTools } from "@mod-utils/ChatRoomOrder";
import { Tools } from "@mod-utils/Tools";

/** @type { CustomActivity } */
const activity = {
    activity: {
        Name: "手推车",
        Prerequisite: [
            "UseHands",
            "Luzi_TargetLeashedOrCanBeLeashed",
            () => !!AssetGet("Female3DCG", "ItemMisc", "抓住推车"),
            Prereqs.Acted.GroupIs("ItemDevices", ["Trolley"]),
            Prereqs.or(Prereqs.Acting.GroupEmpty("ItemMisc"), Prereqs.Acting.GroupIs("ItemMisc", ["抓住推车"])),
        ],
        MaxProgress: 50,
        Target: ["ItemTorso"],
    },
    run: (player, sender, { TargetCharacter, SourceCharacter }) => {
        if (TargetCharacter === player.MemberNumber) {
            // 遵守物品权限
            if (!ServerChatRoomGetAllowItem(sender, player)) return;
            Tools.findCharacter("SourceC", SourceCharacter)
                .then(() => AssetGet("Female3DCG", "ItemDevices", "Trolley"))
                .then((asset, { SourceC }) => {
                    ChatRoomOrderTools.wearAndPair(player, asset, { prevCharacter: SourceC.MemberNumber }, "follow");
                });
        } else if (SourceCharacter === player.MemberNumber) {
            Tools.findCharacter("TargetC", TargetCharacter)
                .then(() => AssetGet("Female3DCG", "ItemMisc", "抓住推车"))
                .then((asset, { TargetC }) => {
                    ChatRoomOrderTools.wearAndPair(player, asset, { nextCharacter: TargetC.MemberNumber }, "lead");
                });
        }
    },
    useImage: DynImageProviders.itemOnActedGroup("ItemDevices"),
    label: {
        CN: "抓住推车",
        EN: "Grab the Trolley",
    },
    dialog: {
        CN: "SourceCharacter抓住了TargetCharacter的推车.",
        EN: "SourceCharacter grabs the Trolley of TargetCharacter.",
    },
};

const items = [{ prev: "抓住推车", next: "Trolley" }];

export default function () {
    ActivityManager.addCustomActivity(activity);

    SharedCenterModifier.addModifier(
        DrawMods.asset(items, ["center", { X: 50, Y: -50 }], ["center", { X: -50, Y: 0 }])
    );
}
