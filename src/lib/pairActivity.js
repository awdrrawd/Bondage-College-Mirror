import { Tools } from "@mod-utils/Tools";

/**
 * 生成一个跟随与引导的活动执行函数
 * @param {[AssetGroupItemName, string]} followItem
 * @param {[AssetGroupItemName, string]} leadItem
 * @param {"prev"|"next"} leadMode
 * @returns {CustomActivity["run"]}
 */
export function createFollowLeadRunner(followItem, leadItem, leadMode) {
    const follow = (C) =>
        /** @type {PrevOrNextXCharacter}*/ ({
            [leadMode === "next" ? "prevCharacter" : "nextCharacter"]: C.MemberNumber,
        });
    const lead = (C) =>
        /** @type {PrevOrNextXCharacter}*/ ({
            [leadMode === "next" ? "nextCharacter" : "prevCharacter"]: C.MemberNumber,
        });

    return (player, sender, { SourceCharacter, TargetCharacter }) => {
        if (TargetCharacter === player.MemberNumber) {
            if (!ServerChatRoomGetAllowItem(sender, player)) return;
            Tools.findCharacter("SourceC", SourceCharacter)
                .then(() => AssetGet("Female3DCG", followItem[0], followItem[1]))
                .then((asset, { SourceC }) => this.wearAndPair(player, asset, follow(SourceC), "follow"));
        } else if (SourceCharacter === player.MemberNumber) {
            Tools.findCharacter("TargetC", TargetCharacter)
                .then(() => AssetGet("Female3DCG", leadItem[0], leadItem[1]))
                .then((asset, { TargetC }) => this.wearAndPair(player, asset, lead(TargetC), "lead"));
        }
    };
}
