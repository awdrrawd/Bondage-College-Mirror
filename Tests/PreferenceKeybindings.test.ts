import { Game } from "./Utils";

Game.load("../Scripts/Common.js");
Game.load("../Scripts/Text.js");
Game.load("../Screens/Character/Preference/Keybindings.js");

function delayedCache() {
	let finish!: () => void;
	const loadedPromise = new Promise<TextCache>(resolve => {
		finish = () => resolve({} as TextCache);
	});
	return { cache: { loadedPromise } as TextCache, finish };
}

describe("Keybinding screen translation loading", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		Game.CurrentScreen = "Preference";
		Game.PreferenceSubscreen = { name: "Keybindings" } as PreferenceSubscreen;
		Game.KeyGUI.loadGeneration = 0;
		jest.spyOn(Game, "ScreenFileGetTranslation").mockReturnValue("keys.csv");
		jest.spyOn(Game, "PreferenceSubscreenKeybindingsResize").mockImplementation(() => {});
	});

	it("waits for the selected language before building the first view", async () => {
		const pending = delayedCache();
		jest.spyOn(Game, "TextPrefetchFile").mockReturnValue(pending.cache);
		const build = jest.spyOn(Game.KeyGUI, "buildSubscreen").mockImplementation(() => {});
		Game.PreferenceSubscreenKeybindingsLoad();
		expect(build).not.toHaveBeenCalled();
		pending.finish();
		await pending.cache.loadedPromise;
		expect(build).toHaveBeenCalledTimes(1);
		expect(Game.PreferenceSubscreenKeybindingsResize).toHaveBeenCalledWith(true);
	});

	it("does not recreate a view that was closed while loading", async () => {
		const pending = delayedCache();
		jest.spyOn(Game, "TextPrefetchFile").mockReturnValue(pending.cache);
		const build = jest.spyOn(Game.KeyGUI, "buildSubscreen").mockImplementation(() => {});
		Game.PreferenceSubscreenKeybindingsLoad();
		Game.PreferenceSubscreen = { name: "Main" } as PreferenceSubscreen;
		pending.finish();
		await pending.cache.loadedPromise;
		expect(build).not.toHaveBeenCalled();
	});

	it("ignores a stale request after the screen is opened again", async () => {
		const older = delayedCache();
		const newer = delayedCache();
		jest.spyOn(Game, "TextPrefetchFile").mockReturnValueOnce(older.cache).mockReturnValueOnce(newer.cache);
		const build = jest.spyOn(Game.KeyGUI, "buildSubscreen").mockImplementation(() => {});
		Game.PreferenceSubscreenKeybindingsLoad();
		Game.PreferenceSubscreenKeybindingsLoad();
		newer.finish();
		await newer.cache.loadedPromise;
		older.finish();
		await older.cache.loadedPromise;
		expect(build).toHaveBeenCalledTimes(1);
	});
});
