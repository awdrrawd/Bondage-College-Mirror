import { ActivityManager } from "../../activityForward";
import { ChatRoomOrder } from "@mod-utils/ChatRoomOrder";
import { SharedCenterModifier, DrawMods } from "@mod-utils/ChatRoomOrder";
import { Prereqs } from "../../prereqs";

/** @type { CustomActivity } */
const activity = {
    activity: {
        Name: "驾驶马车",
        Prerequisite: [
            "UseFeet",
            Prereqs.Acting.GroupIs("ItemDevices", ["马车"]),
            Prereqs.Acted.GroupIs("ItemDevices", ["马车前"]),
        ],
        MaxProgress: 50,
        Target: ["ItemTorso"],
    },
    run: (player, sender, info) => {
        if (info.TargetCharacter === player.MemberNumber) {
            // 遵守物品权限
            if (!ServerChatRoomGetAllowItem(sender, player)) return;

            const SrcChara = ChatRoomCharacter.find((C) => C.MemberNumber === info.SourceCharacter);
            if (!SrcChara) return;
            ChatRoomOrder.setDrawOrder({
                prevCharacter: SrcChara.MemberNumber,
                associatedAsset: {
                    group: "ItemDevices",
                    asset: "马车前",
                },
                leash: "lead",
            });
            ChatRoomLeashPlayer = SrcChara.MemberNumber;
        } else if (info.SourceCharacter === player.MemberNumber) {
            const TgtChara = ChatRoomCharacter.find((C) => C.MemberNumber === info.TargetCharacter);
            if (!TgtChara) return;
            InventoryWear(player, "马车", "ItemDevices");
            ChatRoomOrder.setDrawOrder({
                nextCharacter: TgtChara.MemberNumber,
                associatedAsset: {
                    group: "ItemDevices",
                    asset: "马车",
                },
                leash: "follow",
            });
            ChatRoomCharacterUpdate(player);
            if (ChatRoomLeashList.indexOf(TgtChara.MemberNumber) < 0) ChatRoomLeashList.push(TgtChara.MemberNumber);
        }
    },
    useImage: "Wiggle",
    label: {
        CN: "驾驶马车",
    },
    dialog: {
        CN: "SourceCharacter乘上了TargetCharacter身后的马车.",
    },
};

const items = [{ prev: "马车", next: "马车前" }];

export default function () {
    ActivityManager.addCustomActivity(activity);
    SharedCenterModifier.addModifier(DrawMods.asset(items, ["center", { X: -130, Y: 0 }], ["center", { X: 80, Y: 0 }]));
}
