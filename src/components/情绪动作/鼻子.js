import { ActivityManager } from "../../activityForward";

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "嗅手",
            Prerequisite: [],
            MaxProgress: 50,
            Target: ["ItemHands"],
            TargetSelf: true,
        },
        useImage: "Kiss",
        label: {
            CN: "嗅手",
            EN: "Sniff",
            RU: "Понюхать Руку",
            UA: "Нюхати руку",
        },
        dialog: {
            CN: "SourceCharacter 用鼻子嗅了嗅 TargetCharacter 的手.",
            EN: "SourceCharacter sniffs DestinationCharacter hand.",
            RU: "SourceCharacter нюхает руку TargetCharacter.",
            UA: "SourceCharacter винюхує руку TargetCharacter.",
        },
        dialogSelf: {
            CN: "SourceCharacter 用鼻子嗅了嗅自己的手.",
            EN: "SourceCharacter sniffs own hand.",
            RU: "SourceCharacter нюхает свою руку.",
            UA: "SourceCharacter винюхає свою руку.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
