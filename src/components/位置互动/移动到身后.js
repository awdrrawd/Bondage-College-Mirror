import { ChatRoomOrder } from "@mod-utils/ChatRoomOrder";
import { ActivityManager } from "../../activityForward";
import { DrawMods, SharedCenterModifier } from "@mod-utils/ChatRoomOrder";

/** @type {CustomActivity["run"]} */
const moveBehindRun = (player, sender, { TargetCharacter, SourceCharacter }) => {
    if (TargetCharacter === player.MemberNumber) {
        if (!ServerChatRoomGetAllowItem(sender, player)) return;
        ChatRoomOrder.setDrawOrder({
            prevCharacter: SourceCharacter,
            timer: Date.now() + 15000,
            reason: "移动到身后",
        });
    } else if (SourceCharacter === player.MemberNumber) {
        ChatRoomOrder.setDrawOrder({
            nextCharacter: TargetCharacter,
            timer: Date.now() + 15000,
            reason: "移动到身后",
        });
    }
};

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "躲到身后",
            Prerequisite: ["Luzi_CharacterViewWithinReach"],
            MaxProgress: 50,
            Target: ["ItemTorso"],
        },
        useImage: "SistersHug",
        run: moveBehindRun,
        label: {
            CN: "躲到身后",
            EN: "Hide Behind",
            UA: "Сховатись",
        },
        dialog: {
            CN: "SourceCharacter躲到TargetCharacter的身后.",
            EN: "SourceCharacter hides behind TargetCharacter.",
            UA: "SourceCharacter ховається позаду TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "移动到身后",
            Prerequisite: ["Luzi_CharacterViewWithinReach"],
            MaxProgress: 50,
            Target: ["ItemTorso"],
        },
        useImage: "SistersHug",
        run: moveBehindRun,
        label: {
            CN: "移动到身后",
            EN: "Move Behind",
            UA: "Стати позаду",
        },
        dialog: {
            CN: "SourceCharacter移动到TargetCharacter的身后.",
            EN: "SourceCharacter moves behind TargetCharacter.",
            UA: "SourceCharacter стає позаду TargetCharacter.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
    SharedCenterModifier.addModifier(DrawMods.timer(["next"], ["unchanged"]));
}
