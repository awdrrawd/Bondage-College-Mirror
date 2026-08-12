import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "撞笼子",
            Prerequisite: ["Luzi_HasKennel"],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemArms"],
        },
        useImage: ["ItemDevices", "Kennel"],
        labelSelf: {
            CN: "撞击笼子",
            EN: "Ramming the Cage",
            RU: "Таран клетки",
            UA: "Таран клітки",
        },
        dialogSelf: {
            CN: "SourceCharacter用全身重量猛烈撞击着笼子，发出沉闷的声响。",
            EN: "SourceCharacter slams PronounPossessive full weight against the cage with a resounding thud.",
            RU: "SourceCharacter со всей силы бьётся телом о клетку, издавая глухой стук.",
            UA: "SourceCharacter з усієї сили вдаряє своїм тілом об клітку, видаючи глухий звук.",
        },
    },
    {
        activity: {
            Name: "咬笼子",
            Prerequisite: ["Luzi_HasKennel", "UseMouth"],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemMouth"],
        },
        useImage: ["ItemDevices", "Kennel"],
        labelSelf: {
            CN: "啃咬笼栏",
            EN: "Gnawing the Bars",
            RU: "Грызть прутья",
            UA: "Гризти прути",
        },
        dialogSelf: {
            CN: "SourceCharacter用牙齿狠狠啃咬着笼子的金属栏杆，发出刺耳的摩擦声。",
            EN: "SourceCharacter gnaws fiercely at the metal bars, creating an unpleasant grating noise.",
            RU: "SourceCharacter яростно грызёт металлические прутья клетки, издавая скрежещущий звук.",
            UA: "SourceCharacter люто гризе металеві прути клітки, видаючи скрегітливий звук.",
        },
    },
    {
        activity: {
            Name: "摇晃笼子",
            Prerequisite: ["Luzi_HasKennel", "UseArms"],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemArms"],
        },
        useImage: ["ItemDevices", "Kennel"],
        labelSelf: {
            CN: "摇晃笼子",
            EN: "Rattling the Cage",
            RU: "Трясти клетку",
            UA: "Трясти клітку",
        },
        dialogSelf: {
            CN: "SourceCharacter疯狂摇晃着笼子，试图让整个结构松动。",
            EN: "SourceCharacter violently shakes the cage, trying to loosen its structure.",
            RU: "SourceCharacter яростно трясёт клетку, пытаясь расшатать конструкцию.",
            UA: "SourceCharacter несамовито трясе клітку, намагаючись послабити її конструкцію.",
        },
    },
    {
        activity: {
            Name: "抓挠笼子",
            Prerequisite: ["Luzi_HasKennel", "UseArms", "UseHands"],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemHands"],
        },
        useImage: ["ItemDevices", "Kennel"],
        labelSelf: {
            CN: "抓挠笼子",
            EN: "Scratch at Cage",
            RU: "Царапать клетку",
            UA: "Дряпати клітку",
        },
        dialogSelf: {
            CN: "SourceCharacter用爪子抓挠笼子的栏杆，发出刺耳的金属摩擦声。",
            EN: "SourceCharacter scrapes PronounPossessive claws against the cage bars, making a sharp metallic screech.",
            RU: "SourceCharacter царапает когтями прутья клетки, издавая резкий металлический скрежет.",
            UA: "SourceCharacter дряпає кігтями прути клітки, видаючи різкий металевий скрегіт.",
        },
    },
    {
        activity: {
            Name: "推挤笼门",
            Prerequisite: ["Luzi_HasKennel"],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemArms"],
        },
        useImage: ["ItemDevices", "Kennel"],
        labelSelf: {
            CN: "推挤笼门",
            EN: "Shove the Door",
            RU: "Толкать дверцу",
            UA: "Штовхати дверцята",
        },
        dialogSelf: {
            CN: "SourceCharacter用肩膀猛力推挤笼门。",
            EN: "SourceCharacter rams PronounPossessive shoulder against the cage door.",
            RU: "SourceCharacter с силой толкает дверцу клетки плечом.",
            UA: "SourceCharacter з усієї сили штовхає плечем дверцята клітки.",
        },
    },
    {
        activity: {
            Name: "啃咬笼锁",
            Prerequisite: ["Luzi_HasKennel", "UseMouth"],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemMouth"],
        },
        useImage: ["ItemDevices", "Kennel"],
        labelSelf: {
            CN: "啃咬笼锁",
            EN: "Gnaw at the Lock",
            RU: "Грызть замок",
            UA: "Гризти замок",
        },
        dialogSelf: {
            CN: "SourceCharacter用牙齿狠狠啃咬着笼子的锁扣，试图把它咬坏。",
            EN: "SourceCharacter gnaws viciously at the cage lock, trying to break it open.",
            RU: "SourceCharacter яростно грызёт замок клетки, пытаясь его сломать.",
            UA: "SourceCharacter люто гризе замок клітки, намагаючись його зламати.",
        },
    },
    {
        activity: {
            Name: "蜷缩角落",
            Prerequisite: ["Luzi_HasKennel"],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemTorso"],
        },
        useImage: ["ItemDevices", "Kennel"],
        labelSelf: {
            CN: "蜷缩角落",
            EN: "Curl Up in Corner",
            RU: "Сжаться в углу",
            UA: "Згорнутися в кутку",
        },
        dialogSelf: {
            CN: "SourceCharacter缩在笼子的角落里，拒绝与外界互动。",
            EN: "SourceCharacter curls up in the corner of the cage, refusing to engage with anything outside.",
            RU: "SourceCharacter сжимается в углу клетки, игнорируя всё происходящее снаружи.",
            UA: "SourceCharacter згортається в кутку клітки, ігноруючи все навколо.",
        },
    },
    {
        activity: {
            Name: "摩擦笼子",
            Prerequisite: ["Luzi_HasKennel", "Luzi_Female", "Luzi_ActedZoneNaked"],
            MaxProgress: 100,
            Target: [],
            TargetSelf: ["ItemVulva"],
        },
        useImage: ["ItemDevices", "Kennel"],
        labelSelf: {
            CN: "摩擦笼子",
            EN: "Rubbing the Cage",
            RU: "Тереть клетку",
            UA: "Терти клітку",
        },
        dialogSelf: {
            CN: "SourceCharacter笨拙地扭动腰身，用阴部摩擦笼子的金属栏杆",
            EN: "SourceCharacter awkwardly writhes, rubbing PronounPossessive vulva against the metal bars of the cage.",
            RU: "SourceCharacter неуклюже извивается, теряя вульвой металлические прутья клетки.",
            UA: "SourceCharacter незграбно звивається, теребля вульвою металеві прути клітки.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
