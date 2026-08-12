import { ActivityManager } from "../../activityForward";
import { SharedCenterModifier, DrawMods } from "@mod-utils/ChatRoomOrder";
import { Prereqs } from "../../prereqs";
import { ChatRoomOrderTools } from "@mod-utils/ChatRoomOrder";
import { Tools } from "@mod-utils/Tools";

/** @type { CustomActivity} */
const activity = {
    activity: {
        Name: "扛起",
        Prerequisite: [
            () => !!AssetGet("Female3DCG", "ItemMisc", "扛起来的麻袋"),
            Prereqs.or(Prereqs.Acting.GroupEmpty("ItemMisc"), Prereqs.Acting.GroupIs("ItemMisc", ["扛起来的麻袋"])),
            Prereqs.Acted.GroupIs("ItemDevices", "BurlapSack"),
        ],
        MaxProgress: 50,
        Target: ["ItemTorso"],
    },
    run: (player, sender, { SourceCharacter, TargetCharacter }) => {
        if (TargetCharacter === player.MemberNumber) {
            Tools.findCharacter("SourceC", SourceCharacter)
                .then(() => AssetGet("Female3DCG", "ItemDevices", "BurlapSack"))
                .then((asset, { SourceC }) => {
                    ChatRoomOrderTools.wearAndPair(player, asset, { nextCharacter: SourceC.MemberNumber }, "follow");
                });
        } else if (SourceCharacter === player.MemberNumber) {
            Tools.findCharacter("TargetC", TargetCharacter)
                .then(() => AssetGet("Female3DCG", "ItemMisc", "扛起来的麻袋"))
                .then((asset, { TargetC }) => {
                    ChatRoomOrderTools.wearAndPair(player, asset, { prevCharacter: TargetC.MemberNumber }, "lead");
                });
        }
    },
    useImage: ["ItemDevices", "BurlapSack"],
    label: {
        CN: "背起",
        EN: "Carry on the back",
        RU: "Нести на спине",
        UA: "Тягнути на спині",
    },
    dialog: {
        CN: "SourceCharacter将TargetCharacter背了起来.",
        EN: "SourceCharacter carried TargetCharacter on the back.",
        RU: "SourceCharacter взял TargetCharacter себе на спину.",
        UA: "SourceCharacter тягне TargetCharacter взявши собі на спину.",
    },
};

const items = [{ prev: "BurlapSack", next: "扛起来的麻袋" }];

export default function () {
    ActivityManager.addCustomActivity(activity);

    SharedCenterModifier.addModifier(
        DrawMods.asset(
            items,
            (state, ctx) => {
                const { sharedC } = ctx;
                if (sharedC.next.ActivePose[0] === "Kneel" || sharedC.next.ActivePose[0] === "KneelingSpread") {
                    return DrawMods.builder("center", { X: 0, Y: -120 })(state, ctx);
                } else {
                    return DrawMods.builder("center", { X: 0, Y: -340 })(state, ctx);
                }
            },
            ["center"]
        )
    );
}
