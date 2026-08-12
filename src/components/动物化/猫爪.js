import { ActivityManager } from "../../activityForward";
import { DynImageProviders } from "../../dynamicImage";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "猫爪挠手",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemHands"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪轻挠手心",
            EN: "Gentle Paw Scratch",
            RU: "Нежно поцарапать ладонь",
            UA: "Ніжно подряпати долоню",
        },
        dialog: {
            CN: "SourceCharacter用毛茸茸的爪子轻轻挠了挠TargetCharacter的手心。",
            EN: "SourceCharacter gently scratches DestinationCharacter palm with PronounPossessive fluffy paw.",
            RU: "SourceCharacter нежно царапает ладонь TargetCharacter своей пушистой лапкой.",
            UA: "SourceCharacter ніжно дряпає долоню TargetCharacter своєю пухнастою лапкою.",
        },
    },
    {
        activity: {
            Name: "猫爪挠手臂",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemArms"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪轻挠手臂",
            EN: "Gentle Arm Scratch",
            RU: "Нежно поцарапать руку",
            UA: "Ніжно подряпати руку",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻在TargetCharacter的手臂上挠了几下。",
            EN: "SourceCharacter gives DestinationCharacter arm a few gentle scratches with PronounPossessive paw.",
            RU: "SourceCharacter нежно проводит коготками по руке TargetCharacter.",
            UA: "SourceCharacter ніжно проводить кігтями по руці TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪舔手",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms", "UseTongue"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemHands"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        labelSelf: {
            CN: "舔舐猫爪",
            EN: "Lick Paw Gently",
            RU: "Аккуратно вылизать лапку",
            UA: "Обережно вилизати лапку",
        },
        dialogSelf: {
            CN: "SourceCharacter像小猫一样仔细地舔着自己的爪子。",
            EN: "SourceCharacter carefully licks PronounPossessive paw, just like a kitten would.",
            RU: "SourceCharacter аккуратно вылизывает свою лапку, совсем как котёнок.",
            UA: "SourceCharacter обережно вилизує свою лапку, наче справжній кошеня.",
        },
    },
    {
        activity: {
            Name: "猫爪戳脸",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪轻戳脸颊",
            EN: "Soft Paw Poke",
            RU: "Нежно ткнуть лапкой",
            UA: "Ніжно ткнути лапкою",
        },
        dialog: {
            CN: "SourceCharacter用肉垫轻轻戳了戳TargetCharacter的脸颊。",
            EN: "SourceCharacter softly pokes DestinationCharacter cheek with PronounPossessive paw pad.",
            RU: "SourceCharacter нежно тыкает своей мягкой лапкой в щёку TargetCharacter.",
            UA: "SourceCharacter ніжно тикає своєю м'якою лапкою в щоку TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪戳鼻子",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemNose"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪轻点鼻尖",
            EN: "Boop the Nose",
            RU: "Ткнуть в носик",
            UA: "Ткнути в носик",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻点了点TargetCharacter的鼻尖。",
            EN: "SourceCharacter playfully boops DestinationCharacter nose with PronounPossessive paw.",
            RU: "SourceCharacter игриво тыкает лапкой в носик TargetCharacter.",
            UA: "SourceCharacter грайливо тикає лапкою в носик TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪揉脸",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪轻揉脸蛋",
            EN: "Gentle Face Knead",
            RU: "Нежно помять личико",
            UA: "Ніжно пом'яти личко",
        },
        dialog: {
            CN: "SourceCharacter用毛茸茸的爪子轻轻揉着TargetCharacter的脸蛋。",
            EN: "SourceCharacter gently kneads DestinationCharacter cheeks with PronounPossessive fluffy paws.",
            RU: "SourceCharacter нежно мнёт щёчки TargetCharacter своими пушистыми лапками.",
            UA: "SourceCharacter ніжно м'яти щічки TargetCharacter своїми пухнастими лапками.",
        },
    },
    {
        activity: {
            Name: "猫爪揉鼻子",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemNose"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪轻揉鼻头",
            EN: "Nose Kneading",
            RU: "Мять носик",
            UA: "М'яти носик",
        },
        dialog: {
            CN: "SourceCharacter用爪子温柔地揉着TargetCharacter的鼻头。",
            EN: "SourceCharacter affectionately kneads DestinationCharacter nose with PronounPossessive paws.",
            RU: "SourceCharacter нежно мнёт носик TargetCharacter своими лапками.",
            UA: "SourceCharacter ніжно м'яти носик TargetCharacter своїми лапками.",
        },
    },
    {
        activity: {
            Name: "猫爪拍手",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 30,
            Target: ["ItemHands"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪击掌",
            EN: "Paw High-five",
            RU: "Лапка да пять",
            UA: "Лапка до п'яти",
        },
        dialog: {
            CN: "SourceCharacter举起毛茸茸的爪子，轻轻拍在TargetCharacter的手掌上。",
            EN: "SourceCharacter raises PronounPossessive fluffy paw to give DestinationCharacter a gentle high-five.",
            RU: "SourceCharacter поднимает пушистую лапку, чтобы нежно дать пять TargetCharacter.",
            UA: "SourceCharacter піднімає пухнасту лапку, щоб ніжно дати п'ять TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪梳毛",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 60,
            Target: ["ItemHead"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪顺毛",
            EN: "Paw Grooming",
            RU: "Причесать лапкой",
            UA: "Чесати лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻梳理着TargetCharacter的头发。",
            EN: "SourceCharacter gently combs DestinationCharacter hair with PronounPossessive paws.",
            RU: "SourceCharacter нежно расчёсывает волосы TargetCharacter своей лапкой.",
            UA: "SourceCharacter ніжно розчісує волосся TargetCharacter своєю лапкою.",
        },
    },
    {
        activity: {
            Name: "猫爪遮眼",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 20,
            Target: ["ItemHead"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "爪爪遮眼睛",
            EN: "Paw Peek-a-boo",
            RU: "Лапки-невидимки",
            UA: "Лапки-невидимки",
        },
        dialog: {
            CN: "SourceCharacter调皮地用爪子盖住了TargetCharacter的眼睛。",
            EN: "SourceCharacter playfully covers DestinationCharacter eyes with PronounPossessive paws in a kittenish game.",
            RU: "SourceCharacter озорно закрывает лапками глаза TargetCharacter, играя в кошачьи прятки.",
            UA: "SourceCharacter жартівливо закриває лапками очі TargetCharacter, граючи у котячі хованки.",
        },
    },
    {
        activity: {
            Name: "猫爪握手",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 40,
            Target: ["ItemHands"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪握手手",
            EN: "Paw Handshake",
            RU: "Пожать лапку",
            UA: "Потиснути лапку",
        },
        dialog: {
            CN: "SourceCharacter把毛茸茸的小爪子搭在TargetCharacter的手心里。",
            EN: "SourceCharacter places PronounPossessive fluffy little paw into DestinationCharacter open palm.",
            RU: "SourceCharacter кладёт свою пушистую лапку на раскрытую ладонь TargetCharacter.",
            UA: "SourceCharacter кладе свою пухнасту лапку на відкриту долоню TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪拍头",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 30,
            Target: ["ItemHead"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪拍头",
            EN: "Paw Head Pat",
            RU: "Погладить голову лапкой",
            UA: "Погладити голову лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻拍了拍TargetCharacter的头。",
            EN: "SourceCharacter gently pats DestinationCharacter head with PronounPossessive paw.",
            RU: "SourceCharacter нежно гладит голову TargetCharacter своей лапкой.",
            UA: "SourceCharacter ніжно гладить голову TargetCharacter своєю лапкою.",
        },
    },
    {
        activity: {
            Name: "猫爪按手",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 40,
            Target: ["ItemHands"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪按手",
            EN: "Paw Press Hand",
            RU: "Нажать лапкой на руку",
            UA: "Натиснути лапкою на руку",
        },
        dialog: {
            CN: "SourceCharacter用爪子按在TargetCharacter的手上。",
            EN: "SourceCharacter presses PronounPossessive paw against DestinationCharacter hand.",
            RU: "SourceCharacter нажимает своей лапкой на руку TargetCharacter.",
            UA: "SourceCharacter натискає своєю лапкою на руку TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪摸脸",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemMouth"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪摸脸",
            EN: "Paw Face Touch",
            RU: "Потрогать лицо лапкой",
            UA: "Поторкати лице лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻摸了摸TargetCharacter的脸。",
            EN: "SourceCharacter gently touches DestinationCharacter face with PronounPossessive paw.",
            RU: "SourceCharacter нежно трогает лицо TargetCharacter своей лапкой.",
            UA: "SourceCharacter ніжно торкається лице TargetCharacter своєю лапкою.",
        },
    },
    {
        activity: {
            Name: "猫爪拍肩",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 30,
            Target: ["ItemArms"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪拍肩",
            EN: "Paw Shoulder Tap",
            RU: "Хлопнуть лапкой по плечу",
            UA: "Ляпнути лапкою по плечу",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻拍了拍TargetCharacter的肩膀。",
            EN: "SourceCharacter gently taps DestinationCharacter shoulder with PronounPossessive paw.",
            RU: "SourceCharacter нежно хлопает лапкой по плечу TargetCharacter.",
            UA: "SourceCharacter ніжно ляскає лапкою по плечу TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪碰鼻",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 20,
            Target: ["ItemNose"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪碰鼻",
            EN: "Paw Nose Bump",
            RU: "Коснуться носа лапкой",
            UA: "Торкнутися носа лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻碰了碰TargetCharacter的鼻子。",
            EN: "SourceCharacter gently bumps DestinationCharacter nose with PronounPossessive paw.",
            RU: "SourceCharacter нежно касается носа TargetCharacter своей лапкой.",
            UA: "SourceCharacter ніжно торкається носа TargetCharacter своєю лапкою.",
        },
    },
    {
        activity: {
            Name: "猫爪拍肚",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 30,
            Target: ["ItemPelvis"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪拍肚",
            EN: "Paw Belly Pat",
            RU: "Похлопать по животу лапкой",
            UA: "Поплескати по животу лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻拍了拍TargetCharacter的肚子。",
            EN: "SourceCharacter gently pats DestinationCharacter belly with PronounPossessive paw.",
            RU: "SourceCharacter нежно хлопает лапкой по животу TargetCharacter.",
            UA: "SourceCharacter ніжно плеще лапкою по животу TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪揉肚",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemPelvis"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪揉肚",
            EN: "Paw Belly Rub",
            RU: "Помассировать живот лапкой",
            UA: "Помасажувати живіт лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻揉着TargetCharacter的肚子。",
            EN: "SourceCharacter gently rubs DestinationCharacter belly with PronounPossessive paws.",
            RU: "SourceCharacter нежно массирует живот TargetCharacter своей лапкой.",
            UA: "SourceCharacter ніжно масажує живіт TargetCharacter своєю лапкою.",
        },
    },
    {
        activity: {
            Name: "猫爪暖腹",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 60,
            Target: ["ItemPelvis"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪暖腹",
            EN: "Paw Belly Warm",
            RU: "Согреть живот лапкой",
            UA: "Зігріти живіт лапкою",
        },
        dialog: {
            CN: "SourceCharacter把温暖的爪子贴在TargetCharacter的肚子上。",
            EN: "SourceCharacter places PronounPossessive warm paws on DestinationCharacter belly.",
            RU: "SourceCharacter прикладывает тёплую лапку к животу TargetCharacter.",
            UA: "SourceCharacter прикладає теплу лапку до живота TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪画圈",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 40,
            Target: ["ItemPelvis"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪画圈圈",
            EN: "Paw Circle Drawing",
            RU: "Рисовать круги лапкой",
            UA: "Малювати кружечки лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子在TargetCharacter肚子上画着小圆圈。",
            EN: "SourceCharacter draws little circles on DestinationCharacter belly with PronounPossessive paw.",
            RU: "SourceCharacter рисует маленькие кружки на животе TargetCharacter своей лапкой.",
            UA: "SourceCharacter малює маленькі кружечки на животі TargetCharacter своєю лапкою.",
        },
    },
    {
        activity: {
            Name: "猫爪轻按",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 30,
            Target: ["ItemPelvis"],
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪轻按",
            EN: "Paw Gentle Press",
            RU: "Легко нажать лапкой",
            UA: "Легко натиснути лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻按着TargetCharacter的下腹部。",
            EN: "SourceCharacter gently presses PronounPossessive paw against DestinationCharacter lower belly.",
            RU: "SourceCharacter слегка нажимает лапкой на низ живота TargetCharacter.",
            UA: "SourceCharacter легко натискає лапкою на низ живота TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "猫爪护裆",
            Prerequisite: ["Luzi_HasPawMittens", "UseArms"],
            MaxProgress: 20,
            Target: ["ItemVulva"],
            TargetSelf: true,
        },
        useImage: DynImageProviders.itemOnActingGroup("ItemHands"),
        label: {
            CN: "猫爪防护",
            EN: "Paw Protective Cover",
            RU: "Прикрыть лапкой",
            UA: "Захистити лапкою",
        },
        dialog: {
            CN: "SourceCharacter用爪子轻轻护住TargetCharacter的私密部位。",
            EN: "SourceCharacter gently covers DestinationCharacter private area with PronounPossessive paws.",
            RU: "SourceCharacter нежно прикрывает интимную зону TargetCharacter своей лапкой.",
            UA: "SourceCharacter ніжно прикриває інтимну зону TargetCharacter своєю лапкою.",
        },
    },
    {
        activity: {
            Name: "捏猫爪",
            Prerequisite: ["Luzi_TargetHasPawMittens", "UseArms"],
            MaxProgress: 20,
            Target: ["ItemHands"],
        },
        useImage: DynImageProviders.itemOnActedGroup("ItemHands"),
        label: {
            CN: "揉捏猫爪",
            EN: "Squeeze the Paw",
        },
        dialog: {
            CN: "SourceCharacter轻轻揉捏着TargetCharacter的爪子肉垫。",
            EN: "SourceCharacter gently squeezes DestinationCharacter paw cushion.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
