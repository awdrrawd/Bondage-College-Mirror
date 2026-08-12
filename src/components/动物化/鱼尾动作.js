import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "鱼尾揉脸",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾揉脸",
            EN: "Rub Face with Tail",
            UA: "Терти лице риб'ячим хвостом",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾揉了揉TargetCharacter的脸.",
            EN: "SourceCharacter rubs DestinationCharacter face with a fish tail.",
            UA: "SourceCharacter тре лице TargetCharacter своїм риб'ячим хвостом.",
        },
        dialogSelf: {
            CN: "SourceCharacter用鱼尾揉了揉PronounPossessive自己的脸.",
            EN: "SourceCharacter rubs PronounPossessive face with a fish tail.",
            UA: "SourceCharacter тре своє лице риб'ячим хвостом.",
        },
    },
    {
        activity: {
            Name: "鱼尾戳脸",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾戳脸",
            EN: "Fish Tail Pokes Face",
            UA: "Тицьнути лице риб'ячим хвостом",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾戳了戳TargetCharacter的脸.",
            EN: "SourceCharacter pokes DestinationCharacter face with a fish tail.",
            UA: "SourceCharacter тицяє лице TargetCharacter риб'ячим хвостом.",
        },
        dialogSelf: {
            CN: "SourceCharacter用鱼尾戳了戳PronounPossessive自己的脸.",
            EN: "SourceCharacter pokes PronounPossessive face with a fish tail.",
            UA: "SourceCharacter тицяє собі лице своїм риб'ячим хвостом.",
        },
    },
    {
        activity: {
            Name: "鱼尾抚脸",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾抚脸",
            EN: "Fish Tail Caresses Face",
            UA: "Гладити лице риб'ячим хвостом",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾轻抚TargetCharacter的脸颊.",
            EN: "SourceCharacter gently strokes DestinationCharacter cheek with a fish tail.",
            UA: "SourceCharacter ніжно гладить лице TargetCharacter своїм риб'ячим хвостом.",
        },
        dialogSelf: {
            CN: "SourceCharacter用鱼尾轻抚PronounPossessive自己的脸颊.",
            EN: "SourceCharacter gently strokes PronounPossessive cheek with a fish tail.",
            UA: "SourceCharacter ніжно гладить своє лице риб'ячим хвостом.",
        },
    },
    {
        activity: {
            Name: "鱼尾担膝盖",
            Prerequisite: ["Luzi_Has鱼鱼尾", "TargetKneeling"],
            MaxProgress: 50,
            Target: ["ItemLegs"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾担膝盖",
            EN: "Fish Tail Rests on Knee",
            UA: "Покласти риб'ячий хвіст на стегна",
        },
        dialog: {
            CN: "SourceCharacter将鱼尾担在了TargetCharacter的膝盖上.",
            EN: "SourceCharacter rests PronounPossessive fish tail on DestinationCharacter thighs.",
            UA: "SourceCharacter кладе свій риб'ячий хвіст на стегна TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "鱼尾揉乳房",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemBreast"],
            TargetSelf: true,
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾揉乳房",
            EN: "Fish Tail Rubs Chest",
            UA: "Терти груди риб'ячим хвостом",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾揉了揉TargetCharacter的乳房.",
            EN: "SourceCharacter rubs DestinationCharacter breasts with PronounPossessive fish tail.",
            UA: "SourceCharacter тре груди TargetCharacter своїм риб'ячим хвостом.",
        },
        dialogSelf: {
            CN: "SourceCharacter用鱼尾揉了揉PronounPossessive自己的乳房.",
            EN: "SourceCharacter rubs PronounPossessive own breasts with PronounPossessive fish tail.",
            UA: "SourceCharacter тре свої груди своїм риб'ячим хвостом.",
        },
    },
    {
        activity: {
            Name: "鱼尾扇风",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾扇风",
            EN: "Fish Tail Fans",
            UA: "Подути риб'ячим хвостом",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾给TargetCharacter的脸扇了扇风.",
            EN: "SourceCharacter fanned DestinationCharacter face with PronounPossessive fish tail.",
            UA: "SourceCharacter піддуває лице TargetCharacter своїм риб'ячим хвостом.",
        },
        dialogSelf: {
            CN: "SourceCharacter用鱼尾给自己扇了扇风.",
            EN: "SourceCharacter fanned PronounPossessive own face with fish tail.",
            UA: "SourceCharacter піддуває собі лице своїм риб'ячим хвостом.",
        },
    },
    {
        activity: {
            Name: "鱼尾戳乳头",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemNipples"],
            TargetSelf: true,
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾戳乳头",
            EN: "Fish Tail Pokes Nipple",
            UA: "Тикати в сосок риб'ячим хвостом",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾戳了戳TargetCharacter的乳头.",
            EN: "SourceCharacter pokes DestinationCharacter nipples with PronounPossessive fish tail.",
            UA: "SourceCharacter тицяє своїм хвостом в соски TargetCharacter.",
        },
        dialogSelf: {
            CN: "SourceCharacter用鱼尾戳了戳自己的乳头.",
            EN: "SourceCharacter pokes PronounPossessive own nipples with PronounPossessive fish tail.",
            UA: "SourceCharacter тицяє собі в соски своїм хвостом.",
        },
    },
    {
        activity: {
            Name: "鱼尾碰手",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemHands"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾碰手",
            EN: "Fish Tail Touches Hand",
            UA: "торкунись руки риб'ячим хвостом",
        },
        dialog: {
            CN: "SourceCharacter将鱼尾踝搭在了TargetCharacter的手心上.",
            EN: "SourceCharacter touches TargetCharacter with PronounPossessive fish tail.",
            UA: "SourceCharacter TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "鱼尾抚弄大腿",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemLegs"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾抚弄大腿",
            EN: "Fish Tail Strokes Thigh",
            UA: "Гладити стегно риб'ячим хвостом",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾抚弄TargetCharacter的大腿.",
            EN: "SourceCharacter strokes DestinationCharacter thigh with PronounPossessive fish tail.",
            UA: "SourceCharacter глядить стегна TargetCharacter своїм риб'ячим хвостом.",
        },
    },
    {
        activity: {
            Name: "鱼尾挠肋",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemTorso"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾挠肋",
            EN: "Tail Tickle Ribs",
            RU: "Щекотать рёбра хвостом",
            UA: "Лоскотати ребра хвостом",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾挠了挠TargetCharacter的肋部。",
            EN: "SourceCharacter tickles DestinationCharacter ribs with their fish tail.",
            RU: "SourceCharacter щекочет рёбра TargetCharacter своим рыбьим хвостом.",
            UA: "SourceCharacter лоскоче ребра TargetCharacter своєю риб'ячим хвостом.",
        },
    },
    {
        activity: {
            Name: "尾鳍骚挠鼻子",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemNose"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "尾鳍骚挠鼻子",
            EN: "Caress Nose with Fin",
            RU: "Ласкать нос плавником",
            UA: "Погладжувати ніс плавцем",
        },
        dialog: {
            CN: "SourceCharacter用鱼尾鳍轻轻骚挠TargetCharacter的鼻尖。",
            EN: "SourceCharacter gently caresses DestinationCharacter nose tip with their tail fin.",
            RU: "SourceCharacter нежно ласкает кончик носа TargetCharacter своим хвостовым плавником.",
            UA: "SourceCharacter ніжно пестить кінчик носа TargetCharacter своїм хвостовим плавцем.",
        },
    },
    {
        activity: {
            Name: "鱼尾抓手",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemHands"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾抓手",
            EN: "Grasp Hand with Tail",
            RU: "Обхватить руку хвостом",
            UA: "Обхопити руку хвостом",
        },
        dialog: {
            CN: "SourceCharacter的鱼尾绕上了TargetCharacter的手。",
            EN: "SourceCharacter's fish tail wraps around DestinationCharacter hand.",
            RU: "Рыбий хвост SourceCharacter обвивает руку TargetCharacter.",
            UA: "Риб'ячий хвіст SourceCharacter обвиває руку TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "鱼尾松手",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemHands"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾松手",
            EN: "Release Hand from Tail",
            RU: "Освободить руку из хвоста",
            UA: "Відпустити руку з хвоста",
        },
        dialog: {
            CN: "SourceCharacter的鱼尾松开了TargetCharacter的手。",
            EN: "SourceCharacter's fish tail releases DestinationCharacter hand.",
            RU: "Рыбий хвост SourceCharacter отпускает руку TargetCharacter.",
            UA: "Риб'ячий хвіст SourceCharacter відпускає руку TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "鱼尾缠绕",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemArms"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾缠绕",
            EN: "Tail Coiling",
            RU: "Овивание хвостом",
            UA: "Овивання хвостом",
        },
        dialog: {
            CN: "SourceCharacter的鱼尾紧紧地缠绕住TargetCharacter的手臂。",
            EN: "SourceCharacter's fish tail tightly coils around DestinationCharacter arm.",
            RU: "Рыбий хвост SourceCharacter плотно обвивает руку TargetCharacter.",
            UA: "Риб'ячий хвіст SourceCharacter щільно обвиває руку TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "鱼尾松绑",
            Prerequisite: ["Luzi_Has鱼鱼尾"],
            MaxProgress: 50,
            Target: ["ItemArms"],
        },
        useImage: ["ItemLegs", "MermaidTail"],
        label: {
            CN: "鱼尾松绑",
            EN: "Tail Uncoiling",
            RU: "Освобождение из хвоста",
            UA: "Звільнення з хвоста",
        },
        dialog: {
            CN: "SourceCharacter的鱼尾松开TargetCharacter的手臂。",
            EN: "SourceCharacter's fish tail uncoils from DestinationCharacter arm.",
            RU: "Рыбий хвост SourceCharacter освобождает руку TargetCharacter.",
            UA: "Риб'ячий хвіст SourceCharacter звільняє руку TargetCharacter.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
