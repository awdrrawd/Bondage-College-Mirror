import { ActivityManager } from "../../activityForward";
import { DynImageProviders } from "../../dynamicImage";
import { Prereqs } from "../../prereqs";
import { shakeItem } from "./shakeItem";

const tailRecord = [
    ["TailStrap", "穿戴式猫尾镜像"],
    ["PuppyTailStrap", "穿戴式狗尾镜像"],
    ["PuppyTailStrap1", "穿戴式软小狗尾镜像"],
    ["KittenTailStrap1", "穿戴式浅色猫尾镜像"],
    ["KittenTailStrap2", "小型穿戴式软猫尾镜像"],
    ["FoxTailStrap1", "FoxTailStrap2"],
    ["WolfTailStrap1", "大型穿戴式狼尾镜像"],
    ["WolfTailStrap2", "小型穿戴式狼尾镜像"],
    ["WolfTailStrap3", "白色穿戴式狼尾镜像"],
    ["DragonTailStrap2Left", "DragonTailStrap2Right"],
].reduce((acc, [item1, item2]) => {
    acc[item1] = item2;
    acc[item2] = item1;
    return acc;
}, /** @type {Record<string,string>}*/ ({}));

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "摇晃尾巴",
            Prerequisite: [Prereqs.Acting.GroupIs("TailStraps", Object.keys(tailRecord))],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemButt"],
        },
        mode: "SelfOnSelf",
        run: (player, sender, info) => {
            if (info.SourceCharacter === player.MemberNumber) {
                const asset = InventoryGet(player, "TailStraps");
                if (!asset || !asset.Asset || !asset.Asset.Name) return;
                const asset2Name = tailRecord[asset.Asset.Name];
                if (!asset2Name) return;
                const asset2 = AssetGet("Female3DCG", "TailStraps", asset2Name);
                if (!asset2) return;

                const asset1 = AssetGet("Female3DCG", "TailStraps", asset.Asset.Name);
                if (!asset1) return;

                shakeItem(player, "TailStraps", asset1.Name, asset2.Name);
            }
        },
        useImage: DynImageProviders.itemOnActingGroup("TailStraps"),
        label: {
            CN: "摇晃尾巴",
            EN: "Wag Tail",
            RU: "Вилять хвостом",
        },
        dialog: {
            CN: "SourceCharacter轻轻摇晃着尾巴。",
            EN: "SourceCharacter gently wags PronounPossessive tail.",
            RU: "SourceCharacter нежно виляет хвостом.",
            UA: "SourceCharacter ніжно виляє хвостом.",
        },
    },
    {
        activity: {
            Name: "竖起尾巴",
            Prerequisite: ["Luzi_HasCatTail"],
            MaxProgress: 30,
            Target: [],
            TargetSelf: ["ItemButt"],
        },
        useImage: DynImageProviders.itemOnActingGroup("TailStraps"),
        labelSelf: {
            CN: "竖起尾巴",
            EN: "Raise Tail",
            RU: "Поднять Хвост",
            UA: "Підняти хвіст",
        },
        dialogSelf: {
            CN: "SourceCharacter竖起尾巴。",
            EN: "SourceCharacter raises PronounPossessive tail.",
            RU: "SourceCharacter поднимает хвост。",
            UA: "SourceCharacter піднімає хвіст。",
        },
    },
    {
        activity: {
            Name: "炸毛",
            Prerequisite: ["Luzi_HasCatTail"],
            MaxProgress: 0,
            Target: [],
            TargetSelf: ["ItemButt"],
        },
        useImage: DynImageProviders.itemOnActingGroup("TailStraps"),
        labelSelf: {
            CN: "炸毛",
            EN: "Fur Puffed",
            RU: "Шерсть Дыбом",
            UA: "Шерсть Диби",
        },
        dialogSelf: {
            CN: "SourceCharacter猛地弓起后背，全身毛发炸开，发出威胁的嘶嘶声。",
            EN: "SourceCharacter suddenly arches PronounPossessive back, fur standing on end while emitting a threatening hiss.",
            RU: "SourceCharacter резко выгибает спину, шерсть встаёт дыбом, сопровождая это угрожающим шипением.",
            UA: "SourceCharacter різко вигинає спину, шерсть стає дибки, супроводжуючи це загрозливим шипінням.",
        },
    },
    {
        activity: {
            Name: "舔尾巴",
            Prerequisite: ["Luzi_TargetHasCatTail", "UseTongue"],
            MaxProgress: 60,
            Target: ["ItemButt"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActedGroup("TailStraps"),
        label: {
            CN: "舔尾巴",
            EN: "Lick Tail",
            RU: "Облизать Хвост",
            UA: "Вилизати хвіст",
        },
        dialog: {
            CN: "SourceCharacter温柔地舔舐着TargetCharacter的尾巴，细心地梳理每一根毛发。",
            EN: "SourceCharacter gently licks DestinationCharacter tail, carefully grooming each strand of fur.",
            RU: "SourceCharacter нежно вылизывает хвост TargetCharacter, тщательно причёсывая каждый волосок.",
            UA: "SourceCharacter ніжно вилизує хвіст TargetCharacter, ретельно причісуючи кожну шерстинку.",
        },
        dialogSelf: {
            CN: "SourceCharacter灵活地弯过身子，开始仔细地舔舐自己的尾巴。",
            EN: "SourceCharacter bends flexibly to attentively groom PronounPossessive own tail.",
            RU: "SourceCharacter гибко изгибается, чтобы тщательно вылизать собственный хвост.",
            UA: "SourceCharacter гнучко згинається, щоб ретельно вилизати свій власний хвіст.",
        },
    },
    {
        activity: {
            Name: "轻抚尾巴",
            Prerequisite: [
                "Luzi_TargetHasTail",
                "UseArms",
                "UseHands",
                Prereqs.or(Prereqs.Relation.Lover(), Prereqs.Relation.ActingOwnActed()),
            ],
            MaxProgress: 60,
            Target: ["ItemButt"],
        },
        useImage: DynImageProviders.itemOnActedGroup("TailStraps"),
        label: {
            CN: "抚摸尾巴（充满爱意）",
            EN: "Tail Caress (Lovingly)",
            RU: "Ласкать хвост (с любовью)",
            UA: "Ласкати хвіст (з любов'ю)",
        },
        dialog: {
            CN: "SourceCharacter的手指轻柔地顺着TargetCharacter的尾巴滑下，动作充满爱意。",
            EN: "SourceCharacter's fingers glide tenderly along DestinationCharacter tail in a loving motion.",
            RU: "Пальцы SourceCharacter нежно скользят по хвосту TargetCharacter, полные нежности.",
            UA: "Пальці SourceCharacter ніжно ковзають по хвосту TargetCharacter, сповнені ніжності.",
        },
    },
    {
        activity: {
            Name: "轻抚尾巴",
            Prerequisite: [
                "Luzi_TargetHasTail",
                "UseArms",
                "UseHands",
                Prereqs.nor(Prereqs.Relation.Lover(), Prereqs.Relation.ActingOwnActed()),
            ],
            MaxProgress: 60,
            Target: ["ItemButt"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActedGroup("TailStraps"),
        label: {
            CN: "抚摸尾巴",
            EN: "Tail Caress",
            RU: "Ласкать хвост",
            UA: "Ласкати хвіст",
        },
        dialog: {
            CN: "SourceCharacter轻轻抚过TargetCharacter的尾巴，享受着柔软的触感。",
            EN: "SourceCharacter gently strokes DestinationCharacter tail, enjoying its soft texture.",
            RU: "SourceCharacter нежно гладит хвост TargetCharacter, наслаждаясь его мягкостью.",
            UA: "SourceCharacter ніжно гладить хвіст TargetCharacter, насолоджуючись його м'якістю.",
        },
    },
    {
        activity: {
            Name: "衔尾",
            Prerequisite: ["Luzi_TargetHasCatTail", "UseTongue"],
            MaxProgress: 30,
            Target: ["ItemButt"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActedGroup("TailStraps"),
        label: {
            CN: "衔尾",
            EN: "Tail Holding",
            RU: "Хвост во Рту",
            UA: "Хвіст у Роті",
        },
        dialog: {
            CN: "SourceCharacter轻轻咬住TargetCharacter的尾巴尖，顽皮地拉扯着。",
            EN: "SourceCharacter playfully nips the tip of DestinationCharacter tail, giving it a gentle tug.",
            RU: "SourceCharacter игриво прикусывает кончик хвоста TargetCharacter, слегка потягивая.",
            UA: "SourceCharacter жартівливо прикушує кінчик хвоста TargetCharacter, злегка потягуючи.",
        },
        dialogSelf: {
            CN: "SourceCharacter蜷成一团，将尾巴末端含在嘴里轻轻啃咬。",
            EN: "SourceCharacter curls up, holding the tip of PronounPossessive tail in mouth with gentle nibbles.",
            RU: "SourceCharacter сворачивается клубком, зажав кончик собственного хвоста во рту и слегка покусывая.",
            UA: "SourceCharacter згортається клубком, тримаючи кінчик власного хвоста в роті і злегка покусуючи.",
        },
    },
    {
        activity: {
            Name: "尾巴缠绕",
            Prerequisite: ["Luzi_HasCatTail"],
            MaxProgress: 0,
            Target: ["ItemArms"],
        },
        useImage: DynImageProviders.itemOnActingGroup("TailStraps"),
        label: {
            CN: "尾巴缠绕",
            EN: "Tail Wrap",
            RU: "Обвить Хвостом",
            UA: "Обхопити Хвостом",
        },
        dialog: {
            CN: "SourceCharacter的尾巴悄悄缠上TargetCharacter的手腕，像一条柔软的绳索。",
            EN: "SourceCharacter's tail coils around DestinationCharacter wrist like a soft, living rope.",
            RU: "Хвост SourceCharacter нежно обвивает запястье TargetCharacter, словно мягкая верёвка.",
            UA: "Хвіст SourceCharacter ніжно обвиває зап'ястя TargetCharacter, наче м'яка жива мотузка.",
        },
    },
    {
        activity: {
            Name: "尾巴拍打地面",
            Prerequisite: ["Luzi_HasTail"],
            MaxProgress: 30,
            Target: [],
            TargetSelf: ["ItemButt"],
        },
        useImage: DynImageProviders.itemOnActingGroup("TailStraps"),
        labelSelf: {
            CN: "尾巴拍打地面",
            EN: "Tail Thumping",
            RU: "Хвост бьёт по полу",
            UA: "Хвіст б'є об підлогу",
        },
        dialogSelf: {
            CN: "SourceCharacter的尾巴焦躁地拍打着地面，发出轻微的啪啪声。",
            EN: "SourceCharacter's tail lashes back and forth impatiently, making soft thumping sounds.",
            RU: "Хвост SourceCharacter нервно бьёт по полу, издавая лёгкие шлепки.",
            UA: "Хвіст SourceCharacter нетерпляче б'є туди-сюди, видаючи тихі ляскітливі звуки.",
        },
    },
    {
        activity: {
            Name: "尾巴炸毛",
            Prerequisite: ["Luzi_HasCatTail"],
            MaxProgress: 20,
            Target: [],
            TargetSelf: ["ItemButt"],
        },
        useImage: DynImageProviders.itemOnActingGroup("TailStraps"),
        labelSelf: {
            CN: "尾巴炸毛",
            EN: "Tail Fluff Up",
            RU: "Хвост Ёжиком",
            UA: "Хвіст Диби",
        },
        dialogSelf: {
            CN: "SourceCharacter的尾巴突然炸开，变得蓬松无比，像一把小扫帚。",
            EN: "SourceCharacter's tail suddenly puffs up, becoming twice its size like a tiny broom.",
            RU: "Хвост SourceCharacter внезапно распушается, становясь вдвое больше, словно маленькая метёлка.",
            UA: "Хвіст SourceCharacter раптом стає дибки, збільшуючись вдвічі, наче маленька мітла.",
        },
    },
    {
        activity: {
            Name: "尾巴戳脸",
            Prerequisite: ["Luzi_HasCatTail"],
            MaxProgress: 10,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("TailStraps"),
        label: {
            CN: "尾巴戳脸",
            EN: "Tail Poke Face",
            RU: "Хвостом в Лицо",
            UA: "Хвостом у Обличчя",
        },
        dialog: {
            CN: "SourceCharacter用尾巴轻轻戳了戳TargetCharacter的脸颊。",
            EN: "SourceCharacter pokes DestinationCharacter cheek with PronounPossessive tail.",
            RU: "SourceCharacter тыкает щекой TargetCharacter своим хвостом.",
            UA: "SourceCharacter тицяє щокою TargetCharacter своїм хвостом.",
        },
    },
    {
        activity: {
            Name: "尾巴戳胸",
            Prerequisite: ["Luzi_HasCatTail", "Luzi_TargetHasBreast"],
            MaxProgress: 30,
            Target: ["ItemBreast"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("TailStraps"),
        label: {
            CN: "尾巴戳胸",
            EN: "Tail Poke Breast",
            RU: "Хвостом в Грудь",
            UA: "Хвостом у Грудь",
        },
        dialog: {
            CN: "SourceCharacter用尾巴轻轻戳了戳TargetCharacter的胸部。",
            EN: "SourceCharacter pokes DestinationCharacter breast with PronounPossessive tail.",
            RU: "SourceCharacter тыкает грудь TargetCharacter своим хвостом.",
            UA: "SourceCharacter тицяє груддю TargetCharacter своїм хвостом.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
