import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "抬起屁股",
            Prerequisite: [],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemButt"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "抬起屁股",
            EN: "Lift Buttocks",
            RU: "Поднять Булочки",
            UA: "Підняти сідниці",
        },
        dialogSelf: {
            CN: "SourceCharacter弯腰抬起PronounPossessive的屁股.",
            EN: "SourceCharacter bends over, lifting PronounPossessive buttocks.",
            RU: "SourceCharacter наклоняется, приподнимая свои ягодицы.",
            UA: "SourceCharacter нахиляється, піднімаючи і показуючи свої сідниці.",
        },
    },
    {
        activity: {
            Name: "搂腰",
            Prerequisite: ["UseArms", "UseHands"],
            MaxProgress: 50,
            Target: ["ItemTorso"],
        },
        useImage: "SistersHug",
        label: {
            CN: "搂腰",
            EN: "Embrace Waist",
            RU: "Приобнять за Талию",
            UA: "Обійняти за талію",
        },
        dialog: {
            CN: "SourceCharacter搂住TargetCharacter的腰.",
            EN: "SourceCharacter embraces DestinationCharacter waist.",
            RU: "SourceCharacter приобнимает TargetCharacter за талию.",
            UA: "SourceCharacter обіймає TargetCharacter за талію тягнучи їх ближче до SourceCharacter.",
        },
    },
    {
        activity: {
            Name: "叉腰",
            Prerequisite: ["UseArms", "UseHands"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemTorso"],
        },
        useImage: "Choke",
        labelSelf: {
            CN: "叉腰",
            EN: "Put Hands on Hips",
            RU: "Руки на Бедра",
            UA: "Руки на стегна",
        },
        dialogSelf: {
            CN: "SourceCharacter双手叉在腰上.",
            EN: "SourceCharacter puts PronounPossessive hands on PronounPossessive hips.",
            RU: "SourceCharacter кладет руки на бедра.",
            UA: "SourceCharacter ставить свої руки на свої стегна.",
        },
    },
    {
        activity: {
            Name: "身体颤抖",
            Prerequisite: [],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemTorso"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "身体颤抖",
            EN: "Body Trembles",
            RU: "Дрожать",
            UA: "Тремтіти тілом",
        },
        dialogSelf: {
            CN: "SourceCharacter颤抖着身体.",
            EN: "SourceCharacter's body trembles.",
            RU: "SourceCharacter дрожит всем телом.",
            UA: "Тіло SourceCharacter тремтить як мурашки проходять по PronounPossessive спинію",
        },
    },
    {
        activity: {
            Name: "身体抽搐",
            Prerequisite: [],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemTorso"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "身体抽搐",
            EN: "Body Twitches",
            RU: "Подрагивать Телом",
            UA: "Тремор тіла",
        },
        dialogSelf: {
            CN: "SourceCharacter身体抽搐着.",
            EN: "SourceCharacter's body twitches.",
            RU: "SourceCharacter подрагивает всем телом.",
            UA: "Тіло SourceCharacter тремтить.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
