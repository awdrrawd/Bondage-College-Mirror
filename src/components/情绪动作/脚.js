import { ActivityExt } from "../../activityext";
import { ActivityManager } from "../../activityForward";
import { Prereqs } from "../../prereqs";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "踮起脚尖",
            Prerequisite: [],
            MaxProgress: 30,
            Target: [],
            TargetSelf: ["ItemBoots"],
        },
        useImage: "Kick",
        labelSelf: {
            CN: "踮起脚尖",
            EN: "Tiptoe",
            RU: "На цыпочках",
            UA: "Навшпиньки",
        },
        dialogSelf: {
            CN: "SourceCharacter轻轻踮起脚尖。",
            EN: "SourceCharacter gently rises on tiptoes.",
            RU: "SourceCharacter грациозно приподнимается на цыпочки.",
            UA: "SourceCharacter легко піднімається навшпиньки.",
        },
    },
    {
        activity: {
            Name: "摇晃脚踝",
            Prerequisite: [],
            MaxProgress: 30,
            Target: [],
            TargetSelf: ["ItemBoots"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "晃动脚踝",
            EN: "Ankle Wiggle",
            RU: "Покачивание",
            UA: "Покачування",
        },
        dialogSelf: {
            CN: "SourceCharacter随意地晃动着脚踝。",
            EN: "SourceCharacter casually wiggles ankles.",
            RU: "SourceCharacter расслабленно покачивает стопами.",
            UA: "SourceCharacter невимушено покачує щиколотками.",
        },
    },
    {
        activity: {
            Name: "伸出脚",
            Prerequisite: ["UseFeet"],
            MaxProgress: 70,
            Target: [],
            TargetSelf: ["ItemBoots"],
        },
        useImage: "Kick",
        labelSelf: {
            CN: "伸出腿脚",
            EN: "Leg Outstretch",
            RU: "Вытянуть ногу",
            UA: "Виставити ногу",
        },
        dialogSelf: {
            CN: "SourceCharacter向前伸出腿脚。",
            EN: "SourceCharacter stretches out a leg forward.",
            RU: "SourceCharacter вытягивает ногу вперед.",
            UA: "SourceCharacter витягує ногу вперед.",
        },
    },
    {
        activity: {
            Name: "脚托起下巴",
            Prerequisite: ["UseFeet", "Luzi_IsStanding", "Luzi_TargetKneelOrAllFours"],
            MaxProgress: 80,
            Target: ["ItemNeck", "ItemMouth"],
        },
        useImage: "Wiggle",
        label: {
            CN: "足尖挑下巴",
            EN: "Toe Under Chin",
            RU: "Носок под подбородком",
            UA: "Пальці під підборіддям",
        },
        dialog: {
            CN: "SourceCharacter用足尖轻轻挑起TargetCharacter的下巴。",
            EN: "SourceCharacter lifts DestinationCharacter chin with a toe.",
            RU: "SourceCharacter приподнимает подбородок TargetCharacter носком ноги.",
            UA: "SourceCharacter піднімає підборіддя TargetCharacter пальцями ноги.",
        },
    },
    {
        activity: {
            Name: "双腿颤抖",
            Prerequisite: ["Luzi_TargetHasItemVulva"],
            MaxProgress: 90,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "双腿发颤",
            EN: "Legs Tremble",
            RU: "Дрожь в ногах",
            UA: "Тремтіння ніг",
        },
        dialogSelf: {
            CN: "SourceCharacter的双腿不由自主地颤抖着。",
            EN: "SourceCharacter's legs tremble involuntarily.",
            RU: "Ноги SourceCharacter непроизвольно дрожат.",
            UA: "Ноги SourceCharacter мимоволі тремтять.",
        },
    },
    {
        activity: {
            Name: "摇晃双腿",
            Prerequisite: [],
            MaxProgress: 60,
            Target: [],
            TargetSelf: ["ItemLegs"],
        },
        useImage: "Wiggle",
        labelSelf: {
            CN: "摇晃双腿",
            EN: "Shake Legs",
            RU: "Трясти Ногами",
            UA: "Трясти ногами",
        },
        dialogSelf: {
            CN: "SourceCharacter摇晃PronounPossessive的双腿.",
            EN: "SourceCharacter shakes own legs.",
            RU: "SourceCharacter трясет своими ногами.",
            UA: "SourceCharacter трусить своїми ногами.",
        },
    },
    {
        activity: {
            Name: "跺脚",
            Prerequisite: [],
            MaxProgress: 10,
            Target: [],
            TargetSelf: ["ItemBoots"],
        },
        useImage: "Step",
        labelSelf: {
            CN: "跺跺脚",
            EN: "Foot Stomp",
            RU: "Топанье",
            UA: "Тупання",
        },
        dialogSelf: {
            CN: "SourceCharacter气鼓鼓地跺了跺脚。",
            EN: "SourceCharacter stamps feet in frustration.",
            RU: "SourceCharacter раздраженно топает ногами.",
            UA: "SourceCharacter сердито тупотить ногами.",
        },
    },
    ActivityExt.fromTemplateActivity(
        {
            activity: {
                Name: "脚按摩",
                Prerequisite: ["UseFeet", "Luzi_TargetKneelOrAllFours"],
                MaxProgress: 10,
                Target: ["ItemPelvis", "ItemLegs", "ItemBreast"],
            },
            useImage: "Step",
        },
        {
            CN: {
                ItemPelvis: "小腹",
                ItemLegs: "大腿",
                ItemBreast: "胸部",
            },
            EN: {
                ItemPelvis: "Abdomen",
                ItemLegs: "Thighs",
                ItemBreast: "Breasts",
            },
        },
        {
            label: {
                CN: "脚按摩$group",
                EN: "Foot Massage $group",
            },
            dialog: {
                CN: "SourceCharacter用脚轻柔地按摩着DestinationCharacter的$group。",
                EN: "SourceCharacter gently massages DestinationCharacter $group with feet.",
            },
        }
    ),
    ...ActivityExt.fromTemplateActivity(
        [
            {
                activity: {
                    Name: "脚高处戳",
                    Prerequisite: [
                        "UseFeet",
                        "Luzi_IsStanding",
                        Prereqs.any(Prereqs.Acted.PoseIsAllFours(), Prereqs.Acted.PoseIsHogtied()),
                    ],
                    MaxProgress: 10,
                    Target: ["ItemMouth", "ItemHead", "ItemNose", "ItemNeck", "ItemEars"],
                },
                useImage: "Step",
            },
            {
                activity: {
                    Name: "脚戳中间",
                    Prerequisite: [
                        "UseFeet",
                        "Luzi_IsStanding",
                        Prereqs.any(
                            Prereqs.Acted.PoseIsKneeling(),
                            Prereqs.Acted.PoseIsAllFours(),
                            Prereqs.Acted.PoseIsHogtied()
                        ),
                    ],
                    MaxProgress: 10,
                    Target: ["ItemBreast", "ItemTorso", "ItemLegs", "ItemArms"],
                },
                useImage: "Step",
            },
            {
                activity: {
                    Name: "脚戳低处",
                    Prerequisite: ["UseFeet", "Luzi_IsStanding"],
                    MaxProgress: 10,
                    Target: ["ItemFeet", "ItemBoots"],
                },
                useImage: "Step",
            },
            {
                activity: {
                    Name: "脚戳刺激",
                    Prerequisite: ["UseFeet", "Luzi_IsStanding", "TargetZoneNaked", "Luzi_TargetKneelOrAllFours"],
                    MaxProgress: 60,
                    Target: ["ItemNipples", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
                },
                useImage: "Step",
            },
        ],
        {
            CN: {
                ItemMouth: "脸",
                ItemHead: "额头",
                ItemNose: "鼻子",
                ItemNeck: "脖子",
                ItemEars: "耳朵",
                ItemBreast: "胸部",
                ItemTorso: "腹部",
                ItemLegs: "大腿",
                ItemNipples: "乳头",
                ItemVulva: "阴部",
                ItemVulvaPiercings: "阴蒂",
                ItemButt: "屁股",
                ItemFeet: "小腿",
                ItemBoots: "脚",
                ItemArms: "手臂",
                ItemGlans: "龟头",
                ItemPenis: "阴茎",
            },
            EN: {
                ItemMouth: "Face",
                ItemHead: "Head",
                ItemNose: "Nose",
                ItemNeck: "Neck",
                ItemEars: "Ears",
                ItemBreast: "Breasts",
                ItemTorso: "Torso",
                ItemLegs: "Thighs",
                ItemNipples: "Nipples",
                ItemVulva: "Vulva",
                ItemVulvaPiercings: "Clitoris",
                ItemButt: "Butt",
                ItemFeet: "Calves",
                ItemBoots: "Feet",
                ItemArms: "Arms",
                ItemGlans: "Glans",
                ItemPenis: "Penis",
            },
        },
        {
            label: {
                CN: "脚戳$group",
                EN: "Toe Poke $group",
            },
            dialog: {
                CN: "SourceCharacter用脚戳了戳DestinationCharacter的$group。",
                EN: "SourceCharacter pokes DestinationCharacter $group with toe.",
            },
        }
    ),
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
