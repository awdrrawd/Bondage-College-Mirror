import { sleepFor } from "@sugarch/bc-mod-utility";

/** @type { boolean }*/
let runningShakeItem = false;

/**
 * 道具切换
 * @param {string} item1 - 道具名称 1
 * @param {string} item2 - 道具名称 2
 */
export async function shakeItem(player, itemgroup, item1, item2) {
    if (runningShakeItem) return;
    runningShakeItem = true;
    const propColor = InventoryGet(player, itemgroup).Color;

    const wearAndUpdate = (itemName) => {
        InventoryWear(player, itemName, itemgroup, propColor, undefined, undefined, undefined, false);
        ChatRoomCharacterUpdate(player);
    };

    try {
        for (let i = 0; i < 2; i++) {
            await sleepFor(200);
            wearAndUpdate(item2);
            await sleepFor(200);
            wearAndUpdate(item1);
        }
    } finally {
        if (runningShakeItem) {
            runningShakeItem = false;
            return;
        }
    }
}
