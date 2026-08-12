import { Prereqs } from "../../prereqs";
import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "跪下",
            Prerequisite: [
                Prereqs.ActingCheck(
                    (C) =>
                        C.IsStanding() &&
                        Math.max(...PoseAllKneeling.map((p) => PoseCanChangeUnaidedStatus(Player, p))) >= 2
                ),
            ],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        mode: "SelfOnSelf",
        override: () => ChatRoomToggleKneel(),
        useImage: "Wiggle",
        labelSelf: {
            CN: "跪下",
            EN: "Kneel Down",
            UA: "Сісти на коліна",
        },
        dialogSelf: {
            CN: "SourceCharacter轻轻地跪了下来.",
            EN: "SourceCharacter kneels down gently.",
            UA: "SourceCharacter ніжно сідає на коліна.",
        },
    },
    {
        activity: {
            Name: "站起来",
            Prerequisite: [
                Prereqs.ActingCheck(
                    (C) =>
                        C.IsKneeling() &&
                        Math.max(...PoseAllStanding.map((p) => PoseCanChangeUnaidedStatus(Player, p))) >= 2
                ),
            ],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        mode: "SelfOnSelf",
        override: () => ChatRoomToggleKneel(),
        useImage: "Wiggle",
        labelSelf: {
            CN: "站起来",
            EN: "Stand Up",
            UA: "Встати",
        },
        dialogSelf: {
            CN: "SourceCharacter手扶着地站了起来.",
            EN: "SourceCharacter stands up with hands on the ground.",
            UA: "SourceCharacter встає, тримаючи руки на землі.",
        },
    },
    {
        activity: {
            Name: "跪着张开腿",
            Prerequisite: [
                Prereqs.and(
                    Prereqs.Acting.PoseIs("BodyLower", "Kneel"),
                    Prereqs.Acting.PoseAnyAvailable("BodyLower", "KneelingSpread")
                ),
            ],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        mode: "SelfOnSelf",
        run: (player) => PoseSetActive(player, "KneelingSpread"),
        useImage: "Wiggle",
        labelSelf: {
            CN: "跪着张开腿",
            EN: "Kneel with Legs Spread",
            UA: "Сісти розширені коліна",
        },
        dialogSelf: {
            CN: "SourceCharacter跪下，并张开了自己的腿.",
            EN: "SourceCharacter kneels with legs spread.",
            UA: "SourceCharacter сідає на розширені коліна.",
        },
    },
    {
        activity: {
            Name: "跪着并拢腿",
            Prerequisite: [
                Prereqs.and(
                    Prereqs.Acting.PoseIs("BodyLower", "KneelingSpread"),
                    Prereqs.Acting.PoseAnyAvailable("BodyLower", "Kneel")
                ),
            ],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        mode: "SelfOnSelf",
        run: (player) => PoseSetActive(player, "Kneel"),
        useImage: "Wiggle",
        labelSelf: {
            CN: "跪着并拢腿",
            EN: "Kneel with Legs Closed",
            UA: "Сісти на закриті коліна",
        },
        dialogSelf: {
            CN: "SourceCharacter跪下，并并拢了自己的腿.",
            EN: "SourceCharacter kneels with legs closed.",
            UA: "SourceCharacter сідає на закриті коліна.",
        },
    },
    {
        activity: {
            Name: "四肢着地",
            Prerequisite: [Prereqs.Acting.PoseAnyAvailable("BodyFull", "AllFours")],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemBoots"],
        },
        useImage: "Wiggle",
        mode: "SelfOnSelf",
        run: (player) => PoseSetActive(player, "AllFours"),
        labelSelf: {
            CN: "四肢着地",
            EN: "All Fours",
            UA: "Стати на всі чотири",
        },
        dialogSelf: {
            CN: "SourceCharacter四肢着地趴在地上.",
            EN: "SourceCharacter lies down on all fours.",
            UA: "SourceCharacter падає на землю стаючи на всі чотири.",
        },
    },
    {
        activity: {
            Name: "起身跪下",
            Prerequisite: [
                Prereqs.and(
                    Prereqs.Acting.PoseIs("BodyFull", "AllFours"),
                    Prereqs.Acting.PoseAnyAvailable("BodyLower", "Kneel")
                ),
            ],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemBoots"],
        },
        useImage: "Wiggle",
        mode: "SelfOnSelf",
        run: (player) => PoseSetActive(player, "Kneel"),
        labelSelf: {
            CN: "起身跪下",
            EN: "Get Up and Kneel",
            UA: "Встати і сісти на коліна.",
        },
        dialogSelf: {
            CN: "SourceCharacter起身跪下.",
            EN: "SourceCharacter get up and kneels down.",
            UA: "SourceCharacter встає і сідає на коліна.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
