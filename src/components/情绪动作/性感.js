import { Prereqs } from "../../prereqs";
import { ActivityManager } from "../../activityForward";
import { ActivityExt } from "../../activityext";
import { createActivityStateCtrl } from "../../lib/statedActivity";

const fingerState = createActivityStateCtrl();

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "阴部轻蹭手",
            Prerequisite: ["HasVagina", "Luzi_PrivateExposed"],
            MaxProgress: 99,
            Target: ["ItemHands"],
        },
        useImage: "Wiggle",
        label: {
            CN: "阴部轻蹭",
            EN: "Groin Nuzzle",
            RU: "Ласка пахом",
            UA: "Тертя пахом",
        },
        dialog: {
            CN: "SourceCharacter用阴部轻蹭TargetCharacter的手.",
            EN: "SourceCharacter nuzzles DestinationCharacter hand with their groin.",
            RU: "SourceCharacter нежно трется пахом о руку TargetCharacter.",
            UA: "SourceCharacter ніжно треться пахом об руку TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "弹阴蒂",
            Prerequisite: ["UseHands", "UseArms", "Luzi_ActedZoneNaked"],
            MaxProgress: 50,
            Target: ["ItemVulvaPiercings"],
        },
        useImage: "Pinch",
        label: {
            CN: "弹阴蒂",
            EN: "Flick Clitoris",
            RU: "Щелчек по Клитору",
            UA: "Замахувати пальцем об клітор",
        },
        dialog: {
            CN: "SourceCharacter弹了一下TargetCharacter的阴蒂.",
            EN: "SourceCharacter flicks DestinationCharacter clitoris.",
            RU: "SourceCharacter щелкает TargetCharacter по клитору.",
            UA: "SourceCharacter замахується пальцем об клітор TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "揉搓乳头",
            Prerequisite: ["UseHands", "UseArms", "Luzi_ActedZoneNaked"],
            MaxProgress: 99,
            Target: ["ItemNipples"],
            TargetSelf: true,
        },
        useImage: "Pinch",
        label: {
            CN: "揉搓乳头",
            EN: "Rub Nipples",
            RU: "Поиграть с Сосками",
            UA: "Терти соски",
        },
        dialog: {
            CN: "SourceCharacter揉搓TargetCharacter的乳头.",
            EN: "SourceCharacter uses hands to pinch DestinationCharacter nipples, rubbing them.",
            RU: "SourceCharacter вытягивает соски TargetCharacter и массирует их.",
            UA: "SourceCharacter ніжно щипає соски TargetCharacter підтягуючи їх перед тим, як терти їх пальцями.",
        },
    },
    {
        activity: {
            Name: "托起乳房",
            Prerequisite: [],
            MaxProgress: 50,
            Target: ["ItemBreast"],
            TargetSelf: true,
        },
        useImage: "Wiggle",
        label: {
            CN: "托起乳房",
            EN: "Lift Breasts",
            RU: "Приподнять Грудь",
            UA: "Підняти груди",
        },
        dialog: {
            CN: "SourceCharacter托起TargetCharacter的双乳.",
            EN: "SourceCharacter lifts DestinationCharacter breasts.",
            RU: "SourceCharacter приподнимает грудь TargetCharacter.",
            UA: "SourceCharacter ніжно піднямає груди TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "夹紧双腿",
            Prerequisite: ["Luzi_TargetHasItemVulva", Prereqs.Acting.PoseIs("BodyLower", ["LegsClosed", "Kneel"])],
            MaxProgress: 90,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "夹紧双腿",
            EN: "Squeeze thighs",
            RU: "Сжать Ляжки",
            UA: "Стиснути стегна",
        },
        dialogSelf: {
            CN: "SourceCharacter夹紧了自己的腿.",
            EN: "SourceCharacter squeezes their thighs.",
            RU: "SourceCharacter сжимает свои ляжки.",
            UA: "SourceCharacter стискає свої стегна.",
        },
    },
    {
        activity: {
            Name: "手指插进阴道",
            Prerequisite: [
                "UseHands",
                "ZoneNaked",
                "Luzi_ActedZoneNaked",
                Prereqs.ActedCheck(
                    (acted) =>
                        !fingerState.isActive() || fingerState.check((state) => state.target !== acted.MemberNumber)
                ),
            ],
            MaxProgress: 90,
            Target: ["ItemVulva"],
            TargetSelf: true,
        },
        useImage: "MasturbateHand",
        label: {
            CN: "手指插进阴道",
            EN: "Insert Finger into Vagina",
            RU: "Вставить Палец в Вагину",
            UA: "Вставити палець у вагіну",
        },
        dialog: {
            CN: "SourceCharacter手指插进TargetCharacter的阴道内.",
            EN: "SourceCharacter inserts finger into DestinationCharacter vagina.",
            RU: "SourceCharacter вставляет палец в вагину TargetCharacter.",
            UA: "SourceCharacter вставляє палець у вагіну TargetCharacter.",
        },
        run: (player, sender, { SourceCharacterC, TargetCharacter }) => {
            if (SourceCharacterC.IsPlayer()) {
                fingerState.update(TargetCharacter);
            }
        },
    },
    {
        activity: {
            Name: "拔出自己的手指",
            Prerequisite: [
                "UseHands",
                "ZoneNaked",
                "Luzi_ActedZoneNaked",
                Prereqs.ActedCheck((acted) => fingerState.check((state) => state.target === acted.MemberNumber)),
            ],
            MaxProgress: 90,
            Target: ["ItemVulva"],
            TargetSelf: true,
        },
        useImage: "MasturbateHand",
        label: {
            CN: "拔出自己的手指",
            EN: "Remove Finger",
            RU: "Вытащить Палец",
            UA: "Витягнути палець",
        },
        dialog: {
            CN: "SourceCharacter从TargetCharacter的阴道内拔出自己的手指,手指连着TargetCharacter的爱液.",
            EN: "SourceCharacter removes own finger from DestinationCharacter vagina, the finger coated with DestinationCharacter love fluids.",
            RU: "SourceCharacter вынимает покрытый любовным соком палец из вагины TargetCharacter.",
            UA: "SourceCharacter витягує палець покритий тонким шаром сексапільного соку з вагіни TargetCharacter.",
        },
        run: (player, sender, { SourceCharacterC }) => {
            if (SourceCharacterC.IsPlayer()) {
                fingerState.clear();
            }
        },
    },
    {
        activity: {
            Name: "蠕动手指",
            Prerequisite: [
                "UseHands",
                "ZoneNaked",
                "Luzi_ActedZoneNaked",
                Prereqs.ActedCheck((acted) => fingerState.check((state) => state.target === acted.MemberNumber)),
            ],
            MaxProgress: 90,
            Target: ["ItemVulva"],
            TargetSelf: true,
        },
        useImage: "Grope",
        label: {
            CN: "蠕动手指",
            EN: "Wriggle Finger",
            RU: "Двигать Пальцем",
            UA: "SourceCharacter TargetCharacter.",
        },
        dialog: {
            CN: "SourceCharacter在TargetCharacter的阴道内蠕动手指.",
            EN: "SourceCharacter wriggles a finger inside DestinationCharacter vagina.",
            RU: "SourceCharacter двигает пальцем внутри вагины TargetCharacter.",
            UA: "SourceCharacter TargetCharacter.",
        },
        run: (player, sender, { SourceCharacterC }) => {
            if (SourceCharacterC.IsPlayer() && fingerState.isActive()) {
                fingerState.update();
            }
        },
    },
    {
        activity: {
            Name: "快速抽插",
            Prerequisite: [
                "UseHands",
                "ZoneNaked",
                Prereqs.ActedCheck((acted) => fingerState.check((state) => state.target === acted.MemberNumber)),
            ],
            MaxProgress: 100,
            Target: ["ItemVulva"],
            TargetSelf: true,
        },
        useImage: "Pinch",
        label: {
            CN: "用手快速抽插",
            EN: "Quickly Thrust With Finger",
            RU: "Интим",
            UA: "Вштовхувати",
        },
        dialog: {
            CN: "SourceCharacter的手指在TargetCharacter的阴道内快速抽插，摩擦并揉捏着.",
            EN: "SourceCharacter's finger quickly thrusts in and out of DestinationCharacter vagina, rubbing and kneading.",
            RU: "Рука SourceCharacter быстро входит и выходит из вагины TargetCharacter, растягивая и разминая её.",
            UA: "SourceCharacter швидко вштовхує своїми пальцями в вагіну TargetCharacter дразливо бавлячись з PronounPossessive ж вагіною.",
        },
        run: (player, sender, { SourceCharacterC }) => {
            if (SourceCharacterC.IsPlayer() && fingerState.isActive()) {
                fingerState.update();
            }
        },
    },
    {
        activity: {
            Name: "流出液体",
            Prerequisite: ["Luzi_TargetHasItemVulva"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemVulva"],
        },
        useImage: "MoanGagWhimper",
        labelSelf: {
            CN: "流出液体",
            EN: "Liquid Flows",
            RU: "Потечь",
            UA: "Підтікати",
        },
        dialogSelf: {
            CN: "SourceCharacter股间有液体顺着的大腿流下.",
            EN: "Liquid flows down SourceCharacter's thighs.",
            RU: "Жидкость стекает по ляжкам SourceCharacter.",
            UA: "SourceCharacter стікає своєю рідиною по своїх стегнах.",
        },
    },
    {
        activity: {
            Name: "失禁",
            Prerequisite: ["Luzi_TargetHasItemVulva"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemVulva"],
        },
        useImage: "MoanGagWhimper",
        labelSelf: {
            CN: "失禁",
            EN: "Incontinence",
            RU: "Недержание",
            UA: "Недержання",
        },
        dialogSelf: {
            CN: "SourceCharacter的尿液顺着PronounPossessive大腿流下.",
            EN: "SourceCharacter's urine flows down PronounPossessive thighs.",
            RU: "SourceCharacter не выдерживает и писается, обтекая мочой на ногах.",
            UA: "Сеча тече по стегнам SourceCharacter.",
        },
    },
    ...ActivityExt.fromTemplateActivity(
        [
            {
                activity: {
                    Name: "阴茎摩擦",
                    Prerequisite: ["Luzi_CanWalk", "Luzi_HasPenis", "Luzi_PrivateExposed"],
                    MaxProgress: 99,
                    Target: ["ItemHands", "ItemArms", "ItemFeet", "ItemLegs", "ItemButt", "ItemBreast"],
                },
                useImage: "Wiggle",
            },
        ],
        {
            CN: {
                ItemHands: "手",
                ItemArms: "手臂",
                ItemFeet: "脚",
                ItemLegs: "腿",
                ItemButt: "臀部",
                ItemBreast: "胸部",
            },
            EN: {
                ItemHands: "hands",
                ItemArms: "arms",
                ItemFeet: "feet",
                ItemLegs: "legs",
                ItemButt: "butt",
                ItemBreast: "breasts",
            },
        },
        {
            label: {
                CN: "阴茎摩擦",
                EN: "Penis Nuzzle",
            },
            dialog: {
                CN: "SourceCharacter用阴茎摩擦TargetCharacter的$group.",
                EN: "SourceCharacter nuzzles DestinationCharacter $group with PronounPossessive penis.",
            },
        }
    ),
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
