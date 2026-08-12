import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "掰开双腿",
            Prerequisite: [
                "UseHands",
                "UseArms",
                Prereqs.or(
                    Prereqs.and(
                        Prereqs.Acted.PoseIs("BodyLower", "Kneel"),
                        Prereqs.Acted.PoseAnyAvailable("BodyUpper", "KneelingSpread")
                    ),
                    Prereqs.and(
                        Prereqs.Acted.PoseIs("BodyLower", "LegsClosed"),
                        Prereqs.Acted.PoseAnyAvailable("BodyUpper", "BaseLower")
                    )
                ),
            ],
            MaxProgress: 50,
            MaxProgressSelf: 50,
            Target: ["ItemLegs"],
        },
        mode: "OthersOnSelf",
        run: (player, sender) => {
            // 遵守物品权限
            if (!ServerChatRoomGetAllowItem(sender, player)) return;

            if (player.IsKneeling()) PoseSetActive(player, "KneelingSpread");
            else PoseSetActive(player, "BaseLower");
        },
        useImage: "MasturbateFist",
        label: {
            CN: "掰开双腿",
            EN: "Spread Legs",
            RU: "Раздвинуть Ноги",
            UA: "Розширити ноги",
        },
        dialog: {
            CN: "SourceCharacter掰开TargetCharacter的双腿.",
            EN: "SourceCharacter spreads DestinationCharacter legs.",
            RU: "SourceCharacter раздвигает ноги TargetCharacter.",
            UA: "SourceCharacter Розширює ноги TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "合并双腿",
            Prerequisite: [
                "UseHands",
                "UseArms",
                Prereqs.or(
                    Prereqs.and(
                        Prereqs.Acted.PoseIs("BodyLower", "KneelingSpread"),
                        Prereqs.Acted.PoseAnyAvailable("BodyUpper", "Kneel")
                    ),
                    Prereqs.and(
                        Prereqs.Acted.PoseIs("BodyLower", "BaseLower"),
                        Prereqs.Acted.PoseAnyAvailable("BodyUpper", "LegsClosed")
                    )
                ),
            ],
            MaxProgress: 50,
            MaxProgressSelf: 50,
            Target: ["ItemLegs"],
        },
        mode: "OthersOnSelf",
        run: (player, sender) => {
            // 遵守物品权限
            if (!ServerChatRoomGetAllowItem(sender, player)) return;

            if (player.IsKneeling()) PoseSetActive(player, "Kneel");
            else PoseSetActive(player, "LegsClosed");
        },
        useImage: "MasturbateFist",
        label: {
            CN: "合并双腿",
            EN: "Merge Legs",
        },
        dialog: {
            CN: "SourceCharacter用手将DestinationCharacter双腿并拢.",
            EN: "SourceCharacter uses hands to bring DestinationCharacter legs together.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
