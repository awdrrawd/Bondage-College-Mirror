import { Game } from "./Utils";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

// Mock out all the stuff that's required before ChatRoom.js can load
Game.ChatRoomCharacterViewRun = () => {};
Game.ChatRoomCharacterViewDraw = () => {};
Game.ChatRoomCharacterViewDrawUi = () => {};
Game.ChatRoomCharacterViewClick = () => {};
Game.ChatRoomCharacterViewKeyDown = () => {};
Game.ChatRoomCharacterViewCanLeave = () => {};
Game.ChatRoomCharacterViewScreenshot = () => {};
Game.ChatRoomCharacterViewActivate = () => {};

Game.ChatRoomMapViewRun = () => {};
Game.ChatRoomMapViewDraw = () => {};
Game.ChatRoomMapViewDrawUi = () => {};
Game.ChatRoomMapViewClick = () => {};
Game.ChatRoomMapViewKeyDown = () => {};
Game.ChatRoomMapViewKeyUp = () => {};
Game.ChatRoomMapViewMouseDown = () => {};
Game.ChatRoomMapViewMouseUp = () => {};
Game.ChatRoomMapViewMouseMove = () => {};
Game.ChatRoomMapViewMouseWheel = () => {};
Game.ChatRoomMapViewRoomUpdated = () => {};
Game.ChatRoomMapViewCanStartWhisper = () => {};
Game.ChatRoomMapViewCanLeave = () => {};
Game.ChatRoomMapViewScreenshot = () => {};
Game.ChatRoomMapViewActivate = () => {};
Game.ChatRoomMapViewDeactivate = () => {};
Game.ChatRoomMapViewResize = () => {};

Game.load("../Screens/Online/ChatRoom/ChatRoom.js");

Game.load("../Scripts/Common.js");
Game.load("../Scripts/DictionaryBuilder.js");
Game.load("../Scripts/Translation.js");
Game.load("../Scripts/Text.js");
const textGlobals = vm.runInNewContext("({ TextCache, TextAllScreenCache, InterfaceStringsPath })", Game) as {
	TextCache: typeof TextCache;
	TextAllScreenCache: Map<string, TextCache>;
	InterfaceStringsPath: string;
};

describe("Mod action placeholders", () => {
	const actionText = "Cutie pet Lana wiggles her ears.";
	let displayed: string[];
	const message = (Dictionary: ChatMessageDictionaryEntry[] = [{ Tag: "Beep", Text: actionText }]): ServerChatRoomMessage => ({
		Sender: 1, Type: "Action", Content: "Beep", Dictionary,
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		displayed = [];
		Game.ChatRoomData = {} as ChatRoomInfo;
		Game.ChatRoomCharacter = [{ MemberNumber: 1, Name: "Tester" } as Character];
		Game.Player = { ImmersionSettings: {} } as PlayerCharacter;
		Game.ChatRoomMessageExtractors = [Game.ChatRoomMessageDefaultMetadataExtractor];
		Game.ChatRoomMessageHandlers = [{
			Priority: 100, Callback: (_data, _sender, msg) => { displayed.push(msg); },
		}];
		Game.CharacterNickname = () => "Tester";
		Game.AssetStringsPath = "Assets/Female3DCG.csv";
		textGlobals.TextAllScreenCache.clear();
	});

	function setLanguage(language: "EN" | "RU" | "DE" | "CN" | "TW" | "UA") {
		Game.TranslationLanguage = language;
		const csv = Game.CommonParseCSV(fs.readFileSync(path.join(__dirname, "../Screens/Interface.csv"), "utf8"));
		const cache = new textGlobals.TextCache("");
		const lines = language === "EN" ? csv : cache.buildTranslations(csv, Game.TranslationParseTXT(
			fs.readFileSync(path.join(__dirname, `../Screens/Interface_${language}.txt`), "utf8"),
		));
		cache.cacheLines(lines);
		textGlobals.TextAllScreenCache.set(textGlobals.InterfaceStringsPath, cache);
		return cache;
	}

	it.each(["EN", "RU", "DE", "CN", "TW", "UA"] as const)("preserves mod text and normal notifications in %s", language => {
		const cache = setLanguage(language);
		const packet = message();
		const before = JSON.stringify(packet);
		Game.ChatRoomMessage(packet);
		expect(displayed).toEqual([actionText]);
		expect(JSON.stringify(packet)).toBe(before);
		expect(Game.InterfaceTextGet("Beep")).toBe(cache.get("Beep"));
		Game.ChatRoomMessage(message([]));
		expect(displayed[1]).toBe(cache.get("Beep"));
	});

	it.each([[], [{ Tag: "Other", Text: actionText }], [{ Tag: "Beep", Text: "" }], [{ Tag: "Beep", Text: "  " }]])(
		"keeps translated Beep when no usable replacement exists: %j", (...entries) => {
			const cache = setLanguage("RU");
			Game.ChatRoomMessage(message(entries));
			expect(displayed).toEqual([cache.get("Beep")]);
		},
	);

	it("does not change translation lookups inside mod handlers", () => {
		const cache = setLanguage("RU");
		const lookups: string[] = [];
		for (const Priority of [-1, 1]) Game.ChatRoomMessageHandlers.push({
			Priority, Callback: () => { lookups.push(Game.TextQueryMultiple("Beep", [cache])); },
		});
		Game.ChatRoomMessage(message());
		expect(lookups).toEqual([cache.get("Beep"), cache.get("Beep")]);
		expect(displayed).toEqual([actionText]);
	});

	it("respects a pre-handler that blocks a message", () => {
		setLanguage("RU");
		Game.ChatRoomMessageHandlers.unshift({ Priority: -1, Callback: () => true });
		Game.ChatRoomMessage(message());
		expect(displayed).toEqual([]);
	});

	it("uses the content rewritten by a pre-handler", () => {
		const cache = setLanguage("RU");
		Game.ChatRoomMessageHandlers.unshift({ Priority: -1, Callback: () => ({ msg: "BeepFrom" }) });
		Game.ChatRoomMessage(message());
		expect(displayed).toEqual([cache.get("BeepFrom")]);
	});

	it("does not treat a regular chat message as an action template", () => {
		setLanguage("RU");
		Game.ChatRoomMessage({ ...message([]), Type: "Chat" });
		expect(displayed).toEqual(["Beep"]);
	});
});

