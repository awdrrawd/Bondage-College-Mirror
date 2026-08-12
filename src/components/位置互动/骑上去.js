import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";
import { DrawMods, SharedCenterModifier } from "@mod-utils/ChatRoomOrder";
import { Path } from "../../resouce";
import { ChatRoomOrderTools } from "@mod-utils/ChatRoomOrder";
import { Tools } from "@mod-utils/Tools";

/** @type { CustomActivity } */
const activity = {
    activity: {
        Name: "骑上去",
        Prerequisite: [
            Prereqs.or(Prereqs.Acting.GroupIs("ItemTorso", ["缰绳"]), Prereqs.Acting.GroupIs("ItemTorso2", ["缰绳"])),
            Prereqs.Acted.TargetGroupIs(["鞍"]),
        ],
        MaxProgress: 50,
        Target: ["ItemTorso", "ItemTorso2"],
    },
    run: (player, sender, { TargetCharacter, SourceCharacter, ActivityGroup }) => {
        if (TargetCharacter === player.MemberNumber) {
            // 遵守物品权限
            if (!ServerChatRoomGetAllowItem(sender, player)) return;

            Tools.findCharacter("SourceC", SourceCharacter)
                .then(() => InventoryGet(player, ActivityGroup.Name))
                .then((item, { SourceC }) => {
                    ChatRoomOrderTools.wearAndPair(
                        player,
                        item.Asset,
                        { prevCharacter: SourceC.MemberNumber },
                        "follow"
                    );
                    if (PoseAvailable(player, "BodyFull", "AllFours")) {
                        PoseSetActive(player, "AllFours");
                    }
                });
        } else if (SourceCharacter === player.MemberNumber) {
            Tools.findCharacter("TargetC", TargetCharacter)
                .then(() => player.Appearance.find((i) => i.Asset.Name === "缰绳"))
                .then((leashItem, { TargetC }) => {
                    ChatRoomOrderTools.wearAndPair(
                        player,
                        leashItem.Asset,
                        { nextCharacter: TargetC.MemberNumber },
                        "lead"
                    );
                    if (PoseAvailable(player, "BodyLower", "KneelingSpread")) {
                        PoseSetActive(player, "KneelingSpread");
                    }
                });
        }
    },
    useImage: () => Path.resolve("activities/rideon.png"),
    label: {
        CN: "骑上去",
        EN: "Ride On",
        RU: "Поездка",
    },
    dialog: {
        CN: "SourceCharacter骑在TargetCharacter的背上.",
        EN: "SourceCharacter Rides on DestinationCharacter Back.",
        RU: "SourceCharacter ocедлала спину TargetCharacter.",
    },
};

const items = [{ prev: "缰绳", next: "鞍" }];

export default function () {
    ActivityManager.addCustomActivity(activity);
    SharedCenterModifier.addModifier(DrawMods.asset(items, ["center"], ["center"]));
}
