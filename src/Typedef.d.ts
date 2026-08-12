interface Point {
    X: number;
    Y: number;
}

interface Rect {
    X: number;
    Y: number;
    W: number;
    H: number;
}

type CustomActivityPrerequisite =
    | ActivityPrerequisite
    | "Luzi_NotBlind"
    | "Luzi_TargetHasTail"
    | "Luzi_HasWings"
    | "Luzi_TargetHasWings"
    | "Luzi_TargetCanBeLeashed"
    | "Luzi_TargetLeashedOrCanBeLeashed"
    | "Luzi_IsLeashingTarget"
    | "Luzi_HasTail"
    | "Luzi_HasCatTail"
    | "Luzi_TargetHasCatTail"
    | "Luzi_TargetHasTentacles"
    | "Luzi_ActedZoneNaked"
    | "Luzi_HasTentacles"
    | "Luzi_HasPawMittens"
    | "Luzi_TargetHasPawMittens"
    | "Luzi_HasPetSuit"
    | "Luzi_HasKennel"
    | "Luzi_TargetHasItemVulvaPiercings"
    | "Luzi_TargetHasItemVulva"
    | "Luzi_HasSword"
    | "Luzi_Has鱼鱼尾"
    | "Luzi_CharacterViewWithinReach"
    | "Luzi_Female"
    | "Luzi_TargetFemale"
    | "Luzi_HasBreast"
    | "Luzi_TargetHasBreast"
    | "Luzi_CanWalk"
    | "Luzi_IsStanding"
    | "Luzi_IsKneeling"
    | "Luzi_IsAllFours"
    | "Luzi_KneelOrAllFours"
    | "Luzi_TargetKneelOrAllFours"
    | "Luzi_TargetAllFours"
    | "Luzi_LeashedBy"
    | "Luzi_TargetPelvisExposed"
    | "Luzi_PrivateExposed"
    | "Luzi_HasPenis";

type CustomActivity = import("@sugarch/bc-activity-manager").CustomActivity<string, CustomActivityPrerequisite>;

type PrerequisiteCheckFunction =
    import("@sugarch/bc-activity-manager").PrerequisiteCheckFunction<CustomActivityPrerequisite>;

type CustomActivityPrerequisiteItem =
    import("@sugarch/bc-activity-manager").CustomActivityPrerequisiteItem<CustomActivityPrerequisite>;

type DynamicImageProvier = import("@sugarch/bc-activity-manager").DynamicActivityImageProvider;

type ActivityGroupName = import("@sugarch/bc-mod-types").Translation.ActivityGroupName;

declare module "https://cdn.jsdelivr.net/npm/bondage-club-mod-sdk@1.2.0" {}

declare global {
    interface GlobalThis {
        bcModSdk: typeof import("bondage-club-mod-sdk");
    }
}
