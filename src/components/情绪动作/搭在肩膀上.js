import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "手臂搭在肩膀上",
            Prerequisite: ["UseArms"],
            MaxProgress: 50,
            Target: ["ItemNeck"],
        },
        useImage: "Slap",
        label: {
            CN: "搭肩",
            EN: "Shoulder Lean",
            RU: "Обнять за плечи",
            UA: "Обіймати за плече",
        },
        dialog: {
            CN: "SourceCharacter 自然地伸手，将手臂轻轻搭在 TargetCharacter 的肩上。",
            EN: "SourceCharacter naturally places an arm on DestinationCharacter shoulder.",
            RU: "SourceCharacter непринуждённо кладёт руку на плечо TargetCharacter.",
            UA: "SourceCharacter природно кладе руку на плече TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "下巴搭在肩膀上",
            Prerequisite: [],
            MaxProgress: 50,
            Target: ["ItemNeck"],
        },
        useImage: "RestHead",
        label: {
            CN: "倚靠肩头",
            EN: "Shoulder Rest",
            RU: "Прислониться к плечу",
            UA: "Прислонитися до плеча",
        },
        dialog: {
            CN: "SourceCharacter 将下巴轻轻搁在 TargetCharacter 的肩头。",
            EN: "SourceCharacter gently rests chin on DestinationCharacter shoulder.",
            RU: "SourceCharacter аккуратно кладёт подбородок на плечо TargetCharacter.",
            UA: "SourceCharacter обережно кладе підборіддя на плече TargetCharacter.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
