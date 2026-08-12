import { ActivityManager } from "../../activityForward";
import { makeI18nMessage } from "../../messager";

import { DynImageProviders } from "../../dynamicImage";
import { Prereqs } from "../../prereqs";
import { sleepFor } from "@sugarch/bc-mod-utility";

const beedsDef = {
    AnalBeads2: 0.8,
    大号拉珠: 0.6,
};

let cooldown = true;

const messages = makeI18nMessage({
    FullOut: {
        CN: "SourceCharacter将屁股里的AssetName完全挤出来。",
        EN: "SourceCharacter fully squeezes out AssetName from the butt.",
    },
    Success: {
        CN: "SourceCharacter成功将屁股里的AssetName挤出来其中一个球.",
        EN: "SourceCharacter successfully squeezes out one ball of AssetName from the butt.",
    },
    Failed: {
        CN: "SourceCharacter尝试将塞在屁股里的AssetName挤出来，但失败了.",
        EN: "SourceCharacter tries to squeeze out AssetName stuck in the butt, but failed.",
    },
});

/** @type {CustomActivity} */
const activity = {
    activity: {
        Name: "挤出来球",
        Prerequisite: [
            "TargetZoneAccessible",
            () => cooldown,
            Prereqs.Acted.GroupIs("ItemButt", Object.keys(beedsDef)),
        ],
        MaxProgress: 90,
        Target: [],
        TargetSelf: ["ItemButt"],
    },
    mode: "SelfOnSelf",
    run: async (player, _, { ActivityGroup }) => {
        const item = InventoryGet(player, ActivityGroup.Name);
        if (!item?.Property?.InsertedBeads) return;
        const basePossiblity = beedsDef[item.Asset.Name];
        if (!basePossiblity) return;

        const possibility = (() => {
            const arousalValue = Player.ArousalSettings?.Progress ?? 0;
            const arousalFactor = PreferenceGetArousalZone(player, ActivityGroup.Name)?.Factor ?? 0;

            // 1. P(X) = 1 - 1 / (1 + A X)
            // 2. basePossiblity = P(0.5)

            // P(0.5) = 1 - 1 / (1 + A * 0.5) = basePossiblity
            // A = 2 / (1 - basePossiblity) - 2

            const A = 2 / (1 - basePossiblity) - 2;
            const weightedFactor = (0.3 * arousalValue) / 100 + (0.7 * arousalFactor) / 4;
            return 1 - 1 / (1 + A * weightedFactor);
        })();

        cooldown = false;

        await sleepFor(5000);
        (() => {
            const chance = Math.random();

            /**
             * @param {Parameters<typeof messages.action>[0]} content
             */
            const post = (content) =>
                messages.action(content, {
                    source: player,
                    destination: player,
                    asset: item.Asset,
                    activity: { name: "MasturbateItem", group: "ItemButt" },
                });

            if (chance < possibility) {
                const removing = item.Property.InsertedBeads <= 1;
                if (removing) {
                    const itemGroup = item.Asset.Group.Name;
                    InventoryRemove(player, itemGroup);
                } else {
                    item.Property.InsertedBeads--;
                    item.Property.TypeRecord = { typed: item.Property.InsertedBeads - 1 };
                }

                CharacterRefresh(player, true);
                ChatRoomCharacterUpdate(player);

                if (removing) {
                    post("FullOut");
                } else {
                    post("Success");
                }
            } else {
                post("Failed");
            }
            cooldown = true;
        })();
    },
    useImage: DynImageProviders.itemOnActedGroup("ItemButt"),
    item: (player) => InventoryGet(player, "ItemButt"),
    label: {
        CN: "挤出来一个球",
        EN: "Squeeze out one ball",
    },
    dialog: {
        CN: "SourceCharacter用力试图将塞在屁股里的ActivityAsset挤出来一个.",
        EN: "SourceCharacter tries to squeeze out one ActivityAsset stuck in the butt.",
    },
};

export default function () {
    ActivityManager.addCustomActivity(activity);
}
