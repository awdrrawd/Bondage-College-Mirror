import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "撇眼",
            Prerequisite: [],
            MaxProgress: 50,
            Target: ["ItemHead"],
        },
        useImage: "Wiggle",
        label: {
            CN: "撇眼",
            EN: "Roll Eyes",
            RU: "Закатить Глаза.",
            UA: "Катачи очима",
        },
        dialog: {
            CN: "SourceCharacter撇了TargetCharacter一眼.",
            EN: "SourceCharacter rolls eyes at TargetCharacter.",
            RU: "SourceCharacter закатывает глаза смотря на TargetCharacter.",
            UA: "SourceCharacter закочує очі на TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "环视周围",
            Prerequisite: [],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemNeck", "ItemHead"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "环视周围",
            EN: "Look Around",
            RU: "Посмотреть Вокруг",
            UA: "Роздивитись навчоло",
        },
        dialogSelf: {
            CN: "SourceCharacter环视周围.",
            EN: "SourceCharacter looks around.",
            RU: "SourceCharacter оглядывается вокруг.",
            UA: "SourceCharacter Роздивляється навколо.",
        },
    },
    {
        activity: {
            Name: "上下打量",
            Prerequisite: [],
            MaxProgress: 50,
            Target: ["ItemHead"],
        },
        useImage: "Wiggle",
        label: {
            CN: "上下打量",
            EN: "Take a look",
            RU: "Смерить Взглядом",
            UA: "Оглянути",
        },
        dialog: {
            CN: "SourceCharacter仔细打量着TargetCharacter.",
            EN: "SourceCharacter glance at TargetCharacter.",
            RU: "SourceCharacter оглядывает TargetCharacter с головы до пяток.",
            UA: "SourceCharacter Піддивляється на TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "闭上眼睛",
            Prerequisite: [],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemHead"],
        },
        useImage: "Wiggle",
        mode: "SelfOnSelf",
        run: (player) => CharacterSetFacialExpression(player, "Eyes", "Closed"),
        labelSelf: {
            CN: "闭上眼睛",
            EN: "Close Eyes",
            RU: "Закрыть Глаза",
            UA: "Закрити очі",
        },
        dialogSelf: {
            CN: "SourceCharacter闭上了眼睛.",
            EN: "SourceCharacter closes eyes.",
            RU: "SourceCharacter закрывает глаза.",
            UA: "SourceCharacter закриває очі.",
        },
    },
    {
        activity: {
            Name: "眼睛呆滞",
            Prerequisite: [],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemHead"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "眼睛呆滞",
            EN: "Blank Stare",
            RU: "Уставиться в Пустоту",
            UA: "Дивитись в нікуди",
        },
        dialogSelf: {
            CN: "SourceCharacter呆滞地看着前方.",
            EN: "SourceCharacter stares blankly ahead.",
            RU: "SourceCharacter смотрит вперед с остекленевшим взлядом.",
            UA: "SourceCharacter Витріщається в нікуди.",
        },
    },
    {
        activity: {
            Name: "眼睛湿润",
            Prerequisite: [],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemHead"],
        },
        useImage: "MoanGagWhimper",
        labelSelf: {
            CN: "眼睛湿润",
            EN: "Watery Eyes",
            RU: "Прослезиться",
            UA: "Сльозитися",
        },
        dialogSelf: {
            CN: "SourceCharacter眼角泛着泪光.",
            EN: "SourceCharacter's eyes are watery.",
            RU: "Глаза SourceCharacter намокли.",
            UA: "Очі SourceCharacter сльозяться.",
        },
    },
    {
        activity: {
            Name: "流眼泪",
            Prerequisite: [],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemHead"],
        },
        useImage: "MoanGagWhimper",
        labelSelf: {
            CN: "流眼泪",
            EN: "Shed Tears",
            RU: "Плакать",
            UA: "Розпуститись",
        },
        dialogSelf: {
            CN: "SourceCharacter的眼泪从眼角流下.",
            EN: "SourceCharacter's tears fall from the corners of her eyes.",
            RU: "Слезы текут из уголков глаз SourceCharacter.",
            UA: "Краплі сліз замітні з куточків очей SourceCharacter.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
