import { ActivityManager } from "../../activityForward";
import { DynImageProviders } from "../../dynamicImage";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "宠物服爬到脚边",
            Prerequisite: ["Luzi_HasPetSuit"],
            MaxProgress: 10,
            Target: ["ItemBoots"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemArms"),
        label: {
            CN: "爬向脚边",
            EN: "Crawl to Feet",
            RU: "Подползти к ногам",
            UA: "Повзти до ніг",
        },
        dialog: {
            CN: "SourceCharacter四肢并用，缓缓爬到TargetCharacter脚边。",
            EN: "SourceCharacter crawls on all fours to DestinationCharacter feet.",
            RU: "SourceCharacter подползает на четвереньках к ногам TargetCharacter.",
            UA: "SourceCharacter повзе на чотирьох до ніг TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "宠物服蹭小腿",
            Prerequisite: ["Luzi_HasPetSuit", "MoveHead"],
            MaxProgress: 30,
            Target: ["ItemFeet"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemArms"),
        label: {
            CN: "宠物服蹭小腿",
            EN: "Rub Legs Like a Pet",
            RU: "Игриво Тереться об Ляшки",
            UA: "Тертись об стегна",
        },
        dialog: {
            CN: "SourceCharacter用脑袋轻轻蹭着TargetCharacter的小腿。",
            EN: "SourceCharacter gently rubs against DestinationCharacter calf with PronounPossessive head.",
            RU: "SourceCharacter нежно трётся головой о голень TargetCharacter.",
            UA: "SourceCharacter ніжно треться головою об литку TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "宠物服蹭大腿",
            Prerequisite: ["Luzi_HasPetSuit"],
            MaxProgress: 30,
            Target: ["ItemLegs"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemArms"),
        label: {
            CN: "宠物服蹭大腿",
            EN: "Rub Legs Like a pet",
            RU: "Игриво Тереться об Ноги",
            UA: "Тертись об ноги",
        },
        dialog: {
            CN: "SourceCharacter用脑袋轻轻蹭着TargetCharacter的大腿。",
            EN: "SourceCharacter gently rubs against DestinationCharacter thigh with PronounPossessive head.",
            RU: "SourceCharacter нежно трётся головой о бедро TargetCharacter.",
            UA: "SourceCharacter ніжно треться головою об стегно TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "宠物服趴下",
            Prerequisite: ["Luzi_HasPetSuit", "Luzi_IsKneeling"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemArms"),
        mode: "SelfOnSelf",
        run: (player) => {
            PoseSetActive(player, "AllFours", true);
        },
        labelSelf: {
            CN: "宠物服趴下",
            EN: "Lie Down Like a Pet",
            RU: "На Четвереньки",
            UA: "Стати на чотирьох",
        },
        dialogSelf: {
            CN: "SourceCharacter双肘双膝着地趴伏着。",
            EN: "SourceCharacter gets down on elbows and knees.",
            RU: "SourceCharacter опускается на локти и колени.",
            UA: "SourceCharacter опускається на лікті та коліна.",
        },
    },
    {
        activity: {
            Name: "宠物服跪立",
            Prerequisite: ["Luzi_HasPetSuit", "Luzi_IsAllFours"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemArms"),
        mode: "SelfOnSelf",
        run: (player) => {
            PoseSetActive(player, "Kneel", true);
        },
        labelSelf: {
            CN: "宠物服跪立",
            EN: "Kneel Like a Pet",
            RU: "Встать на Колени",
            UA: "Всістись на коліна",
        },
        dialogSelf: {
            CN: "SourceCharacter手臂离地跪立.",
            EN: "SourceCharacter kneels with PronounPossessive arms off the ground like a pet.",
            RU: "SourceCharacter поднимается с четверенек на коленки.",
            UA: "SourceCharacter всідається на всі чотири ставлячи руки між ногами як тваринка.",
        },
    },
    {
        activity: {
            Name: "宠物服扑",
            Prerequisite: ["Luzi_HasPetSuit", "Luzi_CharacterViewWithinReach"],
            MaxProgress: 60,
            Target: ["ItemArms"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemArms"),
        label: {
            CN: "宠物服扑",
            EN: "Pounces Like a Pet",
            RU: "Игриво Наброситься",
            UA: "Підстрибувати",
        },
        dialog: {
            CN: "SourceCharacter欢快地扑进TargetCharacter怀里。",
            EN: "SourceCharacter joyfully leaps into DestinationCharacter arms.",
            RU: "SourceCharacter радостно прыгает в объятия TargetCharacter.",
            UA: "SourceCharacter радісно стрибає в обійми TargetCharacter.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
