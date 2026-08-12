import { ActivityManager } from "../../activityForward";
import { DynImageProviders } from "../../dynamicImage";
import { Prereqs } from "../../prereqs";
import { shakeItem } from "./shakeItem";

const earRecord = [["KittenEars1", "黑猫耳镜像"]].reduce((acc, [item1, item2]) => {
    acc[item1] = item2;
    acc[item2] = item1;
    return acc;
}, /** @type {Record<string,string>}*/ ({}));

/** @type { CustomActivity []} */
const activities = [
    {
        activity: {
            Name: "摇晃耳朵",
            Prerequisite: [Prereqs.Acting.GroupIs("HairAccessory2", Object.keys(earRecord))],
            MaxProgress: 30,
            Target: [],
            TargetSelf: ["ItemEars"],
        },
        mode: "SelfOnSelf",
        run: (player, sender, info) => {
            if (info.SourceCharacter === player.MemberNumber) {
                const asset = InventoryGet(player, "HairAccessory2");
                if (!asset) return;
                const otherName = earRecord[asset.Asset.Name];
                if (!otherName) return;

                shakeItem(player, "HairAccessory2", asset.Asset.Name, otherName);
            }
        },
        useImage: DynImageProviders.itemOnActingGroup("HairAccessory2"),
        label: {
            CN: "摇晃耳朵",
            EN: "Wag Ears",
            RU: "Вилять ушами",
            UA: "Махати вухами",
        },
        dialog: {
            CN: "SourceCharacter轻轻摇晃着耳朵。",
            EN: "SourceCharacter gently wiggles PronounPossessive ears.",
            RU: "SourceCharacter слегка шевелит ушами.",
            UA: "SourceCharacter ледько поводить вухами.",
        },
    },
];

export default function () {
    ActivityManager.addCustomActivities(activities);
}
