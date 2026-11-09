import fs from "fs";
import path from "path";
import { Game } from "./Utils";

Game.load("../Scripts/Common.js");
Game.load("../Scripts/Translation.js");
Game.load("../Screens/Room/Stable/Stable.js");

it("shows the charged trainer guild fee inside the English and Russian money templates", () => {
	const room = path.join(__dirname, "../Screens/Room/Stable");
	const rows = Game.CommonParseCSV(fs.readFileSync(path.join(room, "Dialog_NPC_Stable_Trainer.csv"), "utf8"));
	const english = rows.find(row => row[0] === "StableBecomeTrainerTrueIntro")?.[3];
	expect(english).toBeDefined();
	const lines = Game.TranslationParseTXT(fs.readFileSync(path.join(room, "Dialog_NPC_Stable_Trainer_RU.txt"), "utf8"));
	const index = lines.indexOf(english);
	expect(index).toBeGreaterThanOrEqual(0);
	expect(index % 2).toBe(0);
	const token = `\${money=${-Game.StableFeeValue("BecomeTrainer")}}`;
	for (const text of [english!, lines[index + 1]]) {
		expect(text).toContain(token);
		expect(text).not.toMatch(/\$\{money=-?\d+\}\d/);
	}
});
