import fs from "fs";
import path from "path";
import { Game } from "./Utils";

Game.load("../Scripts/Common.js");
Game.load("../Scripts/Translation.js");
Game.load("../Scripts/Text.js");

const gameRoot = path.resolve(__dirname, "..");

describe("TextCache.buildTranslations", () => {
	const cache = Game.TextPrefetchFile("");

	it("keeps translated entries and falls back to English for missing keys", () => {
		const lines = [["Name", "Name:"], ["AllowedInteractions", "Allowed interactions:"]];
		expect(cache.buildTranslations(lines, ["Name", "Имя:"])).toEqual([
			["Name", "Имя:"],
			["AllowedInteractions", "Allowed interactions:"],
		]);
		expect(lines[0][1]).toBe("Name:");
	});

	it("preserves substitution placeholders in untranslated strings", () => {
		expect(cache.buildTranslations([["DurationFormatDayFull", "$value$ day(s)"]], [])).toEqual([
			["DurationFormatDayFull", "$value$ day(s)"],
		]);
	});

	it("does not treat a translation value as another key", () => {
		expect(cache.buildTranslations([["Next", "Next page"]], ["Other", "Next", "Last", "Последняя"])).toEqual([
			["Next", "Next page"],
		]);
	});

	it("preserves intentional empty translations and translations equal to the key", () => {
		expect(cache.buildTranslations([["Blank", "Text"], ["Label", "Long label"]], ["Blank", "", "Label", "Label"])).toEqual([
			["Blank", ""],
			["Label", "Label"],
		]);
	});

	it("falls back to English for an incomplete translation pair", () => {
		expect(cache.buildTranslations([["Missing", "Missing translation"]], ["Missing"])).toEqual([
			["Missing", "Missing translation"],
		]);
	});

	it("uses the first translation for duplicate keys, including an empty translation", () => {
		expect(cache.buildTranslations([["Label", "Label text"], ["Blank", "Blank text"]], [
			"Label", "Первый", "Label", "Второй", "Blank", "", "Blank", "Заполнено",
		])).toEqual([
			["Label", "Первый"],
			["Blank", ""],
		]);
	});

	it.each([
		["Screens/Interface", "DurationFormatDayFull", "$value$ day(s)"],
		["Screens/Character/Preference/Text_Preference", "AllowedInteractions", "Allowed interactions:"],
	])("falls back for a missing key in real Russian resources: %s / %s", (file, key, expected) => {
		const lines = Game.CommonParseCSV(fs.readFileSync(path.join(gameRoot, `${file}.csv`), "utf8"));
		const sourceTranslations: string[] = Game.TranslationParseTXT(fs.readFileSync(path.join(gameRoot, `${file}_RU.txt`), "utf8"));
		const translations: string[] = [];
		// Keep the missing-key scenario even after the shipped translation is completed.
		for (let i = 0; i + 1 < sourceTranslations.length; i += 2) {
			if (sourceTranslations[i] !== key) {
				translations.push(sourceTranslations[i], sourceTranslations[i + 1]);
			}
		}
		expect(cache.buildTranslations(lines, translations).find((line: string[]) => line[0] === key)?.[1]).toBe(expected);
	});

	it("preserves an existing translation from real Russian profile resources", () => {
		const file = "Screens/Character/InformationSheet/Text_InformationSheet";
		const lines = Game.CommonParseCSV(fs.readFileSync(path.join(gameRoot, `${file}.csv`), "utf8"));
		const translations = Game.TranslationParseTXT(fs.readFileSync(path.join(gameRoot, `${file}_RU.txt`), "utf8"));
		expect(cache.buildTranslations(lines, translations).find((line: string[]) => line[0] === "Name")?.[1]).toBe("Имя:");
	});
});
