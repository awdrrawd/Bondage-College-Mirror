import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";
import { DrawMods, SharedCenterModifier } from "@mod-utils/ChatRoomOrder";
import { Path } from "../../resouce";
import { monadic } from "@mod-utils/monadic";
import { ChatRoomOrderTools } from "@mod-utils/ChatRoomOrder";
import { Tools } from "@mod-utils/Tools";

/**
 * @param {object} arg
 * @param {XCharacter} arg.next
 * @param {XCharacter} arg.prev
 */
function cuddle({ next, prev }) {
    monadic(AssetGet("Female3DCG", "ItemMisc", "贴贴")).then((asset) => {
        if (prev.MemberNumber === Player.MemberNumber) {
            ChatRoomOrderTools.wearAndPair(Player, asset, { nextCharacter: next.MemberNumber }, "follow");
        } else if (next.MemberNumber === Player.MemberNumber) {
            ChatRoomOrderTools.wearAndPair(Player, asset, { prevCharacter: prev.MemberNumber }, "lead");
        }
        ChatRoomCharacterUpdate(Player);
    });
}

/** @type { CustomActivity[] } */
const activity = [
    {
        activity: {
            Name: "钻进怀里",
            Prerequisite: [
                () => !!AssetGet("Female3DCG", "ItemMisc", "贴贴"),
                "Luzi_CanWalk",
                Prereqs.Acted.GroupEmpty(["ItemMisc"]),
                Prereqs.Acting.GroupEmpty(["ItemMisc"]),
            ],
            MaxProgress: 0,
            Target: ["ItemTorso", "ItemTorso2", "ItemArms"],
        },
        run: (player, sender, { TargetCharacter, SourceCharacter }) => {
            if (TargetCharacter === player.MemberNumber) {
                // 遵守物品权限
                if (!ServerChatRoomGetAllowItem(sender, player)) return;
                Tools.findCharacter("SourceC", SourceCharacter).then((source) =>
                    cuddle({ next: source, prev: player })
                );
            } else if (SourceCharacter === player.MemberNumber) {
                Tools.findCharacter("TargetC", TargetCharacter).then((target) =>
                    cuddle({ next: player, prev: target })
                );
            }
        },
        useImage: () => Path.resolve("activities/cuddle_held.png"),
        label: {
            CN: "钻进怀里",
            EN: "Get In Arms",
        },
        dialog: {
            CN: "SourceCharacter钻进了DestinationCharacter怀里.",
            EN: "SourceCharacter snuggles into DestinationCharacter arms.",
        },
    },
    {
        activity: {
            Name: "抱入怀中",
            Prerequisite: [
                () => !!AssetGet("Female3DCG", "ItemMisc", "贴贴"),
                "Luzi_CanWalk",
                Prereqs.Acted.GroupEmpty(["ItemMisc"]),
                Prereqs.Acting.GroupEmpty(["ItemMisc"]),
            ],
            MaxProgress: 0,
            Target: ["ItemTorso", "ItemTorso2", "ItemArms"],
        },
        run: (player, sender, { TargetCharacter, SourceCharacter }) => {
            if (TargetCharacter === player.MemberNumber) {
                // 遵守物品权限
                if (!ServerChatRoomGetAllowItem(sender, player)) return;
                Tools.findCharacter("SourceC", SourceCharacter).then((source) =>
                    cuddle({ next: player, prev: source })
                );
            } else if (SourceCharacter === player.MemberNumber) {
                Tools.findCharacter("TargetC", TargetCharacter).then((target) =>
                    cuddle({ next: target, prev: player })
                );
            }
        },
        useImage: () => Path.resolve("activities/cuddle_hold.png"),
        label: {
            CN: "抱入怀中",
            EN: "Hold In Arms",
        },
        dialog: {
            CN: "SourceCharacter把TargetCharacter抱进了怀中.",
            EN: "SourceCharacter holds TargetCharacter in arms.",
        },
    },
];

const items = [{ prev: "贴贴", next: "贴贴" }];

export default function () {
    ActivityManager.addCustomActivity(activity);
    SharedCenterModifier.addModifier(DrawMods.asset(items, ["center", { X: 0, Y: -50 }], ["center"]));
}
