import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "捂住头",
            Prerequisite: ["UseHands", "UseArms"],
            MaxProgress: 50,
            Target: ["ItemHead"],
            TargetSelf: true,
        },
        useImage: "HandGag",
        label: {
            CN: "捂住头",
            EN: "Cover Head",
        },
        dialog: {
            CN: "SourceCharacter捂住TargetCharacter的头，试图遮掩DestinationCharacter脸。",
            EN: "SourceCharacter covers DestinationCharacter head with hands, trying to hide DestinationCharacter face.",
        },
    },
    {
        activity: {
            Name: "捂住下体",
            Prerequisite: ["UseHands", "UseArms", "Luzi_ActedZoneNaked"],
            MaxProgress: 50,
            Target: ["ItemVulva"],
            TargetSelf: true,
        },
        useImage: "HandGag",
        label: {
            CN: "捂住下体",
            EN: "Cover Groin",
            RU: "Прикрыть Промежность",
            UA: "Прикрити пах",
        },
        dialog: {
            CN: "SourceCharacter用手掌紧紧捂住TargetCharacter的下体，让手心的温度可以被感受到。",
            EN: "SourceCharacter tightly covers DestinationCharacter groin with hands, letting the warmth of PronounPossessive palm be felt.",
            RU: "SourceCharacter крепко прикрывает промежность TargetCharacter ладонью.",
            UA: "SourceCharacter міцно прикриває пах TargetCharacter долонею.",
        },
        dialogSelf: {
            CN: "SourceCharacter捂住TargetCharacter的下体，试图遮掩自己的身体。",
            EN: "SourceCharacter covers DestinationCharacter groin with hands, trying to hide PronounPossessive body.",
            RU: "SourceCharacter прикрывает промежность TargetCharacter своими руками.",
            UA: "SourceCharacter прикриває пах TargetCharacter.",
        },
    },
    {
        activity: {
            Name: "捂住胸",
            Prerequisite: ["UseHands", "UseArms", "Luzi_HasBreast", "Luzi_ActedZoneNaked"],
            MaxProgress: 50,
            Target: [],
            TargetSelf: ["ItemBreast"],
        },
        useImage: "Pull",
        labelSelf: {
            CN: "捂住胸",
            EN: "Cover Chest",
            RU: "Прикрыть Грудь",
            UA: "Прикрити груди",
        },
        dialogSelf: {
            CN: "SourceCharacter用手捂住自己的胸，试图遮掩自己的身体。",
            EN: "SourceCharacter covers PronounPossessive chest with hands, trying to hide PronounPossessive body.",
            RU: "SourceCharacter прикрывает свою грудь.",
            UA: "SourceCharacter прикриває свої груди.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
