class Actor {
    /**
     * @param {(acting:Character, actor:Character)=>Character} which
     */
    constructor(which) {
        this.which = which;
    }

    /**
     * 姿势状态
     * @param {keyof AssetPoseMap} poseGroup
     * @param {AssetPoseName | AssetPoseName[]} pose
     * @returns {PrerequisiteCheckFunction}
     */
    PoseIs(poseGroup, pose) {
        if (Array.isArray(pose))
            return (_, acting, acted, _2) => pose.includes(this.which(acting, acted).PoseMapping[poseGroup]);
        else return (_, acting, acted, _2) => this.which(acting, acted).PoseMapping[poseGroup] === pose;
    }

    /**
     * 所有站立的姿势状态
     * @returns {PrerequisiteCheckFunction}
     */
    PoseIsStanding() {
        return (_, acting, acted, _2) => this.which(acting, acted).IsStanding();
    }

    /**
     * 所有跪姿的姿势状态
     * @returns {PrerequisiteCheckFunction}
     */
    PoseIsKneeling() {
        return (_, acting, acted, _2) => this.which(acting, acted).IsKneeling();
    }

    PoseIsAllFours() {
        return (_, acting, acted, _2) => this.which(acting, acted).PoseMapping.BodyFull === "AllFours";
    }

    PoseIsHogtied() {
        return (_, acting, acted, _2) => this.which(acting, acted).PoseMapping.BodyFull === "Hogtied";
    }

    /**
     * 表情状态
     * @param {ExpressionGroupName} expressionGroup
     * @param {ExpressionName | ExpressionName[]} expression
     */
    ExpressionIs(expressionGroup, expression) {
        const testExpression = (chara, testFunc) => {
            const expressionItem = InventoryGet(chara, expressionGroup);
            if (!expressionItem || !expressionItem.Property) return false;
            return testFunc(expressionItem.Property?.Expression);
        };

        if (Array.isArray(expression))
            return (_, acting, acted, _2) => testExpression(this.which(acting, acted), (e) => expression.includes(e));
        return (_, acting, acted, _2) => testExpression(this.which(acting, acted), (e) => e === expression);
    }

    /**
     * 姿势可用
     * @param {keyof AssetPoseMap} poseGroup
     * @param {AssetPoseName | AssetPoseName[]} pose
     * @returns {PrerequisiteCheckFunction}
     */
    PoseAnyAvailable(poseGroup, pose) {
        if (Array.isArray(pose))
            return (_, acting, acted, _2) => pose.some((p) => PoseAvailable(this.which(acting, acted), poseGroup, p));
        return (_, acting, acted, _2) => PoseAvailable(this.which(acting, acted), poseGroup, pose);
    }

    /**
     * 动作目标身体部位为空
     * @returns {PrerequisiteCheckFunction}
     */
    TargetGroupEmpty() {
        return (_, acting, acted, group) =>
            this.which(acting, acted).Appearance.every((item) => item.Asset.Group.Name !== group.Name);
    }

    /**
     * 动作目标身体部位物品范围
     * @param {string[]} assetNames
     * @returns {PrerequisiteCheckFunction}
     */
    TargetGroupIs(assetNames) {
        return (_, acting, acted, group) => {
            const item = this.which(acting, acted).Appearance.find((item) => item.Asset.Group.Name === group.Name);
            return item && assetNames.includes(item.Asset.Name);
        };
    }

    /**
     * 身体部位物品范围
     * @param {CustomGroupName} group
     * @param {string[] | string} assetNames
     * @returns {PrerequisiteCheckFunction}
     */
    GroupIs(group, assetNames) {
        const test = (chara, testFunc) => {
            const item = chara.Appearance.find((item) => item.Asset.Group.Name === group);
            if (!item || !item.Asset) return false;
            return testFunc(item.Asset.Name);
        };

        if (Array.isArray(assetNames))
            return (_, acting, acted, _2) => test(this.which(acting, acted), (name) => assetNames.includes(name));
        return (_, acting, acted, _2) => test(this.which(acting, acted), (name) => name === assetNames);
    }

    /**
     * 身体部位为空
     * @param {CustomGroupName[] | CustomGroupName} groups
     * @returns {PrerequisiteCheckFunction}
     */
    GroupEmpty(groups) {
        if (!Array.isArray(groups))
            return (_, acting, acted, _2) =>
                this.which(acting, acted).Appearance.every((item) => item.Asset.Group.Name !== groups);

        const groupNameSet = new Set(groups);

        return (_, acting, acted, _2) =>
            this.which(acting, acted).Appearance.every((item) => !groupNameSet.has(item.Asset.Group.Name));
    }

    /**
     * 身体部位是否可用
     * @param { AssetGroupItemName } group
     */
    GroupAccessible(group) {
        return (_, acting, acted, _2) => !InventoryGroupIsBlocked(this.which(acting, acted), group);
    }
}

class PrereqImpl {
    /** 动作发起者 */
    Acting = new Actor((acting) => acting);

    /** 动作目标 */
    Acted = new Actor((_, acted) => acted);

    /** 关系 */
    Relation = {
        /** @type {()=> PrerequisiteCheckFunction} */
        ActingOwnActed: () => (_, acting, acted, _2) => acted.IsOwnedByCharacter(acting),

        /** @type {()=> PrerequisiteCheckFunction} */
        Lover: () => (_, acting, acted, _2) => acted.IsLoverOfCharacter(acting) && acting.IsLoverOfCharacter(acted),

        /** @type {()=> PrerequisiteCheckFunction} */
        ActedOwnActing: () => (_, acting, acted, _2) => acting.IsOwnedByCharacter(acted),
    };

    /**
     * 获得一个只检查动作发起者的函数
     * @param {(acting:Character)=>boolean} prereqFunc
     * @returns {PrerequisiteCheckFunction}
     */
    ActingCheck = (prereqFunc) => (_, acting, _1, _2) => prereqFunc(acting);

    /**
     * 获得一个只检查动作目标的函数
     * @param {(acted:Character)=>boolean} prereqFunc
     * @returns {PrerequisiteCheckFunction}
     */
    ActedCheck = (prereqFunc) => (_, _1, acted, _2) => prereqFunc(acted);

    /**
     * @param {PrerequisiteCheckFunction} prereqFunc
     * @returns {PrerequisiteCheckFunction}
     */
    not(prereqFunc) {
        return (...args) => !prereqFunc(...args);
    }

    /**
     * @param {PrerequisiteCheckFunction} lhs
     * @param {PrerequisiteCheckFunction} rhs
     * @returns {PrerequisiteCheckFunction}
     */
    and(lhs, rhs) {
        return (...args) => lhs(...args) && rhs(...args);
    }

    /**
     * @param {PrerequisiteCheckFunction} lhs
     * @param {PrerequisiteCheckFunction} rhs
     * @returns {PrerequisiteCheckFunction}
     */
    nand(lhs, rhs) {
        return (...args) => !(lhs(...args) && rhs(...args));
    }

    /**
     * @param {PrerequisiteCheckFunction[]} prereqFuncs
     * @returns {PrerequisiteCheckFunction}
     */
    all(...prereqFuncs) {
        return (...args) => prereqFuncs.every((func) => func(...args));
    }

    /**
     * @param {PrerequisiteCheckFunction[]} prereqFuncs
     * @returns {PrerequisiteCheckFunction}
     */
    any(...prereqFuncs) {
        return (...args) => prereqFuncs.some((func) => func(...args));
    }

    /**
     * @param {PrerequisiteCheckFunction} lhs
     * @param {PrerequisiteCheckFunction} rhs
     * @returns {PrerequisiteCheckFunction}
     */
    or(lhs, rhs) {
        return (...args) => lhs(...args) || rhs(...args);
    }

    /**
     * @param {PrerequisiteCheckFunction} lhs
     * @param {PrerequisiteCheckFunction} rhs
     * @returns {PrerequisiteCheckFunction}
     */
    nor(lhs, rhs) {
        return (...args) => !(lhs(...args) || rhs(...args));
    }

    /**
     * @param {PrerequisiteCheckFunction} lhs
     * @param {PrerequisiteCheckFunction} rhs
     * @returns {PrerequisiteCheckFunction}
     */
    xor(lhs, rhs) {
        return (...args) => lhs(...args) !== rhs(...args);
    }
}

export const Prereqs = new PrereqImpl();
