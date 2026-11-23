import { Game, character } from "./Utils";

import _testParam from "./Activity.json";
const testParam = _testParam as Record<
	keyof typeof _testParam,
	Record<"accept", { group: AssetGroupName, name: AssetName, type?: TypeRecord }[]>
>;

let char: Character;
let player: PlayerCharacter;

beforeAll(async () => {
	await Game.loadAll();
	char = character.create("sourceChar");
	player = Game.Player;
});

beforeEach(() => {
	character.appearanceReset(char);
	character.appearanceReset(player);
});

const siblingPrereqs: ActivityPrerequisite[] = ["Sisters", "Brothers", "SiblingsWithDifferentGender", "SiblingsNeutral"];
const allPronouns: CharacterPronouns[] = ["SheHer", "HeHim", "TheyThem", "ItIt"];

function withPronouns(name: string, pronouns: CharacterPronouns, siblings: boolean): Character {
	const C = character.create(name);
	Game.InventoryWear(C, pronouns, "Pronouns");
	C.IsSiblingOfCharacter = () => siblings;
	return C;
}

function passing(acting: Character, acted: Character): ActivityPrerequisite[] {
	const group = Game.AssetGroupGet("Female3DCG", "ItemArms");
	return siblingPrereqs.filter((prereq) => Game.ActivityCheckPrerequisite(prereq, acting, acted, group));
}

describe("ActivityCheckPrerequisite sibling activities", () => {
	it.each([
		["SheHer", "SheHer", "Sisters"],
		["HeHim", "HeHim", "Brothers"],
		["SheHer", "HeHim", "SiblingsWithDifferentGender"],
		["HeHim", "SheHer", "SiblingsWithDifferentGender"],
		["TheyThem", "SheHer", "SiblingsNeutral"],
		["HeHim", "ItIt", "SiblingsNeutral"],
		["TheyThem", "TheyThem", "SiblingsNeutral"],
	] as const)("%s and %s siblings get only %s", (a, b, expected) => {
		expect(passing(withPronouns("A", a, true), withPronouns("B", b, true))).toEqual([expected]);
	});

	it("every pronoun pair of siblings gets exactly one", () => {
		for (const a of allPronouns) {
			for (const b of allPronouns) {
				expect(passing(withPronouns("A", a, true), withPronouns("B", b, true))).toHaveLength(1);
			}
		}
	});

	it("non-siblings get none", () => {
		for (const a of allPronouns) {
			for (const b of allPronouns) {
				expect(passing(withPronouns("A", a, false), withPronouns("B", b, false))).toEqual([]);
			}
		}
	});
});

describe("ActivityAllowedForGroup Needs-GagItem activities", () => {
	const targetActivities: ActivityName[] = [
		"MoanGag",
		"MoanGagTalk",
		"MoanGagWhimper",
		"MoanGagGroan",
		"MoanGagAngry",
		"MoanGagGiggle",
		"GaggedKiss"
	];

	const targetSelfActivities: ActivityName[] = [
		"GagKiss",
	];

	it.each(testParam.needsGagItem.accept)("Target - $group/$name", ({ group, name, type }) => {
		const item = character.inventoryWear(char, { Group: group, Name: name });
		if (type !== undefined) {
			Game.ExtendedItemSetOptionByRecord(char, item, type, { refresh: true });
		}

		const activities: ActivityName[] = Game.ActivityAllowedForGroup(char, "ItemMouth").map((i: ItemActivity) => i.Activity.Name);
		expect(targetActivities).toEqual(expect.arrayContaining(activities));
	});

	it.each(testParam.needsGagItem.accept)("TargetSelf - $group/$name", ({ group, name, type }) => {
		const item = character.inventoryWear(player, { Group: group, Name: name });
		if (type !== undefined) {
			Game.ExtendedItemSetOptionByRecord(player, item, type, { refresh: true });
		}

		const activities: ActivityName[] = Game.ActivityAllowedForGroup(player, "ItemMouth").map((i: ItemActivity) => i.Activity.Name);
		expect(targetSelfActivities).toEqual(expect.arrayContaining(activities));
	});
});
