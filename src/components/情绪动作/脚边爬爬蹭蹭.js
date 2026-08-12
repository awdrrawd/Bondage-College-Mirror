import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */

const activities = [
    {
        activity: {
            Name: "爬到脚边",
            Prerequisite: ["Luzi_CharacterViewWithinReach", "Luzi_KneelOrAllFours"],
            MaxProgress: 80,
            Target: ["ItemBoots"],
        },
        useImage: "Wiggle",
        label: {
            CN: "爬到脚边",
            EN: "Crawl to Feet",
            RU: "Ползти к Ногам",
            UA: "Повзти до ніг",
        },
        dialog: {
            CN: "SourceCharacter缓缓爬到TargetCharacter的脚边。",
            EN: "SourceCharacter slowly crawls to DestinationCharacter feet.",
            RU: "SourceCharacter медленно подползает к ногам TargetCharacter.",
            UA: "SourceCharacter повільно повзе до ніг TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "蹭大腿",
            Prerequisite: ["Luzi_CharacterViewWithinReach", "Luzi_KneelOrAllFours"],
            MaxProgress: 80,
            Target: ["ItemLegs"],
        },
        useImage: "PoliteKiss",
        label: {
            CN: "轻蹭大腿",
            EN: "Nuzzle Thigh",
            RU: "Ласкаться о бедро",
            UA: "Тертися об стегно",
        },
        dialog: {
            CN: "SourceCharacter亲昵地用头部蹭着TargetCharacter的大腿。",
            EN: "SourceCharacter affectionately nuzzles against DestinationCharacter thigh.",
            RU: "SourceCharacter ласково трется головой о бедро TargetCharacter.",
            UA: "SourceCharacter ніжно треться головою об стегно TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "蹭小腿",
            Prerequisite: ["Luzi_CharacterViewWithinReach", "Luzi_KneelOrAllFours"],
            MaxProgress: 80,
            Target: ["ItemFeet"],
        },
        useImage: "PoliteKiss",
        label: {
            CN: "轻蹭小腿",
            EN: "Nuzzle Shin",
            RU: "Ласкаться о голень",
            UA: "Тертися об гомілку",
        },
        dialog: {
            CN: "SourceCharacter温顺地蹭着TargetCharacter的小腿。",
            EN: "SourceCharacter docilely nuzzles against DestinationCharacter shin.",
            RU: "SourceCharacter послушно трется о голень TargetCharacter.",
            UA: "SourceCharacter покірно треться об гомілку TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "抱腿",
            Prerequisite: ["Luzi_CharacterViewWithinReach", "UseArms", "Luzi_KneelOrAllFours"],
            MaxProgress: 80,
            Target: ["ItemLegs"],
        },
        useImage: "Caress",
        label: {
            CN: "环抱双腿",
            EN: "Embrace Legs",
            RU: "Обхватить ноги",
            UA: "Охопити ноги",
        },
        dialog: {
            CN: "SourceCharacter紧紧抱住TargetCharacter的双腿，显得十分依恋。",
            EN: "SourceCharacter clingingly embraces DestinationCharacter legs.",
            RU: "SourceCharacter крепко обхватывает ноги TargetCharacter, выражая привязанность.",
            UA: "SourceCharacter міцно охоплює ноги TargetCharacter, виражаючи прихильність.",
        },
    },
    {
        activity: {
            Name: "托起脚",
            Prerequisite: ["Luzi_CharacterViewWithinReach", "UseHands", "UseArms", "Luzi_KneelOrAllFours"],
            MaxProgress: 80,
            Target: ["ItemBoots"],
        },
        useImage: "Caress",
        label: {
            CN: "托起脚",
            EN: "Lift Foot",
            RU: "Приподнять Ступню",
            UA: "Підняти ногу",
        },
        dialog: {
            CN: "SourceCharacter小心翼翼地托起TargetCharacter的脚。",
            EN: "SourceCharacter carefully cradles DestinationCharacter foot.",
            RU: "SourceCharacter бережно приподнимает ступню TargetCharacter.",
            UA: "SourceCharacter обережно підтримує стопу TargetCharacter.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
