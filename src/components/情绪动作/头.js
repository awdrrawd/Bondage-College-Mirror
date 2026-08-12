import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "歪头",
            Prerequisite: ["MoveHead"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemNeck", "ItemHead"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "歪头",
            EN: "Tilt Head",
            UA: "Нахилити голову",
            RU: "Наклонить Голову",
        },
        dialogSelf: {
            CN: "SourceCharacter歪头.",
            EN: "SourceCharacter tilts head.",
            UA: "SourceCharacter Підхиляє голову.",
            RU: "SourceCharacter наклоняет голову.",
        },
    },
    {
        activity: {
            Name: "捏脸",
            Prerequisite: ["UseHands", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: "Pinch",
        label: {
            CN: "捏脸",
            EN: "Pinch Face",
            RU: "Ущипнуть за Лицо",
            UA: "Вщипнути обличчя",
        },
        dialog: {
            CN: "SourceCharacter捏了捏TargetCharacter的脸.",
            EN: "SourceCharacter pinches DestinationCharacter face.",
            RU: "SourceCharacter щипает TargetCharacter за лицо.",
            UA: "SourceCharacter вщипує обличчя TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "揉脸",
            Prerequisite: ["UseHands", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: "Wiggle",
        label: {
            CN: "揉脸",
            EN: "Rub Face",
            RU: "Потереть Лицо",
            UA: "Потерти обличчя",
        },
        dialog: {
            CN: "SourceCharacter揉了揉TargetCharacter的脸.",
            EN: "SourceCharacter rubs DestinationCharacter face.",
            RU: "SourceCharacter трет лицо TargetCharacter.",
            UA: "SourceCharacter тре обличчя TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "挠头",
            Prerequisite: ["UseHands", "UseArms"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemHead"],
        },
        useImage: "Pull",
        labelSelf: {
            CN: "挠头",
            EN: "Scratch Head",
            RU: "Почесать Голову",
            UA: "Почухати голову.",
        },
        dialogSelf: {
            CN: "SourceCharacter挠了挠PronounPossessive的头.",
            EN: "SourceCharacter scratches PronounPossessive own head",
            RU: "SourceCharacter чешет голову.",
            UA: "SourceCharacter чухає свою голову.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
