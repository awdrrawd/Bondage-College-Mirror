import { PathTools } from "@sugarch/bc-mod-utility";

export const DynImageProviders = {
    /**
     * 使用动作发起者位于group的物品作为动作图片
     * @param {CustomGroupName} group
     * @returns {DynamicImageProvier}
     */
    itemOnActingGroup: (group) => () => {
        const item = InventoryGet(Player, /** @type {AssetGroupName}*/ (group));
        if (item) return PathTools.assetPreviewIconPath(item);
    },

    /**
     * 使用动作接受者位于group的物品作为动作图片
     * @param {CustomGroupName | CustomGroupName[]} arg
     * @returns {DynamicImageProvier}
     */
    itemOnActedGroup: (arg) => {
        const group = Array.isArray(arg) ? arg : [arg];
        return (_, target) => {
            const item = target.Appearance.find((item) => group.includes(item.Asset.Group.Name));
            if (item) return PathTools.assetPreviewIconPath(item);
        };
    },

    /**
     * 使用动作接受者位于动作目标的物品作为动作图片
     * @returns {DynamicImageProvier}
     */
    itemOnActedTargetGroup: () => (_, target, group) => {
        const item = target.Appearance.find((item) => group === item.Asset.Group.Name);
        if (item) return PathTools.assetPreviewIconPath(item);
    },
};
