"use strict";

// Decals on map objects: the decal picker of the object window, and drawing the decal on objects with a DecalArea

/** @type {Map<DrawSource, Map<string, HTMLCanvasElement>>} - Object images with a decal, by object image, then by decal and color */
var ChatRoomMapViewDecalImages = new Map();

/** @type {Map<AssetName, RectTuple>} - The drawn part of each decal image, without its empty margins */
var ChatRoomMapViewDecalContentRects = new Map();

/**
 * Gets the part of a decal image that is drawn, as decal images come with empty margins of various sizes
 * @param {AssetName} decal
 * @param {CanvasImageSource & { width: number, height: number }} image
 * @returns {RectTuple}
 */
function ChatRoomMapViewGetDecalContentRect(decal, image) {
	const cached = ChatRoomMapViewDecalContentRects.get(decal);
	if (cached) return cached;
	/** @type {RectTuple} */
	let rect = [0, 0, image.width, image.height];
	const canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (ctx) {
		ctx.drawImage(image, 0, 0);
		const data = ctx.getImageData(0, 0, image.width, image.height).data;
		let left = image.width;
		let top = image.height;
		let right = -1;
		let bottom = -1;
		for (let y = 0; y < image.height; y++) {
			for (let x = 0; x < image.width; x++) {
				if (!data[(y * image.width + x) * 4 + 3]) continue;
				left = Math.min(left, x);
				right = Math.max(right, x);
				top = Math.min(top, y);
				bottom = Math.max(bottom, y);
			}
		}
		if (right >= 0) rect = [left, top, right - left + 1, bottom - top + 1];
	}
	ChatRoomMapViewDecalContentRects.set(decal, rect);
	return rect;
}

/** The swatch color of a decal that keeps its own colors */
const ChatRoomMapViewDecalDefaultColor = "#FFFFFF";

/**
 * Gets the image of an object with a decal drawn on its {@link ChatRoomMapObject.DecalArea}, fitted and centered.
 * The decal is part of the object's image, so it turns and sizes with the object.
 * @param {ChatRoomMapObject} obj
 * @param {DrawSource} image - The object's image, plain or colored
 * @param {AssetName} decal - One of {@link AssetGetDecals}
 * @param {HexColor} [color] - The color the decal is tinted with, like a worn decal
 * @returns {DrawSource} - The composed image, or the image given while the decal is not available
 */
function ChatRoomMapViewGetDecalObjectImage(obj, image, decal, color) {
	const area = obj.DecalArea;
	if (!area) return image;
	const key = `${decal}|${color ?? ""}`;
	const cached = ChatRoomMapViewDecalImages.get(image)?.get(key);
	if (cached) return cached;

	const base = typeof image === "string" ? DrawGetImage(image) : image;
	const decalImage = DrawGetImage(`Assets/Female3DCG/Decals/${decal}.png`);
	if (!base || !decalImage) return image;

	const canvas = document.createElement("canvas");
	canvas.width = base.width;
	canvas.height = base.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return image;
	ctx.drawImage(base, 0, 0);
	const [x, y, w, h] = ChatRoomMapViewGetDecalContentRect(decal, decalImage);
	const scale = Math.min(area[2] / w, area[3] / h);
	DrawImageEx(decalImage, ctx, area[0] + (area[2] - w * scale) / 2, area[1] + (area[3] - h * scale) / 2, {
		SourcePos: [x, y, w, h],
		Width: w * scale,
		Height: h * scale,
		HexColor: color,
		FullAlpha: AssetGet("Female3DCG", "Decals", decal)?.Layer[0]?.FullAlpha ?? true,
	});

	if (ChatRoomMapViewDecalImages.size >= 200) ChatRoomMapViewDecalImages.clear();
	const byDecal = ChatRoomMapViewDecalImages.get(image) ?? new Map();
	byDecal.set(key, canvas);
	ChatRoomMapViewDecalImages.set(image, byDecal);
	return canvas;
}

/**
 * Creates the decal rows of the object window: a list of every decal of {@link AssetGetDecals}, so new decals show up without any change here,
 * and the decal's color with a Reset, shown once a decal is chosen
 * @param {ChatRoomMapPos} pos
 * @param {ChatRoomMapObject} object
 * @returns {HTMLElement}
 */
function ChatRoomMapViewCreateDecalPicker(pos, object) {
	const canChange = () => ChatRoomPlayerIsAdmin() && MapManager.Map.getObjectId(pos.X, pos.Y) === object.ID;
	const settings = MapManager.Map.getObjectSettings(pos.X, pos.Y);

	/** @type {ChatRoomMapColorableLayer} */
	const layer = { Name: "", IsColorable: true, DefaultColor: ChatRoomMapViewDecalDefaultColor };
	let changing = false;
	/** @param {HexColor} color */
	const setColor = (color) => {
		if (!canChange()) return;
		const [stored] = ChatRoomMapViewToStoredColors([layer], [color]);
		// One pick in the color picker is one undo step
		MapManager.Map.setObjectSettings(pos.X, pos.Y, { DecalColor: stored === "Default" ? undefined : stored }, !changing);
		changing = true;
	};
	const commit = () => {
		changing = false;
		MapManager.Map.updateGlobalMapData();
	};
	const rows = ChatRoomMapViewCreateColorRows(ChatRoomMapViewGetObjectDisplayName(object), [layer], [settings?.DecalColor ?? layer.DefaultColor],
		() => setColor(rows.getColors()[0]), commit);
	const colors = ElementCreate({
		tag: "div",
		classList: ["chat-room-map-view-dialog-color-list"],
		children: [
			rows.element,
			{
				tag: "div",
				classList: ["chat-room-map-view-dialog-color-buttons"],
				children: [
					ChatRoomMapViewCreateColorButton(TextGet("EditorColorReset"), () => {
						ChatRoomMapViewCloseColorPicker(true);
						if (!MapManager.Map.getObjectSettings(pos.X, pos.Y)?.DecalColor) return;
						rows.setColors([layer.DefaultColor]);
						setColor(layer.DefaultColor);
						commit();
					}),
				],
			},
		],
	});
	colors.hidden = !settings?.Decal;

	const select = /** @type {HTMLSelectElement} */ (ElementCreate({
		tag: "select",
		children: [
			{ tag: "option", attributes: { value: "" }, children: [TextGet("ObjectSettingsDecalNone")] },
			...AssetGetDecals().map(decal => ({ tag: /** @type {const} */ ("option"), attributes: { value: decal.Name }, children: [decal.Description] })),
		],
		eventListeners: {
			change: () => {
				if (!canChange()) return;
				ChatRoomMapViewCloseColorPicker(true);
				const decal = MapIsValidObjectDecal(select.value, object) ? select.value : undefined;
				MapManager.Map.setObjectSettings(pos.X, pos.Y, { Decal: decal });
				MapManager.Map.updateGlobalMapData();
				rows.setColors([MapManager.Map.getObjectSettings(pos.X, pos.Y)?.DecalColor ?? layer.DefaultColor]);
				colors.hidden = !decal;
			},
		},
	}));
	select.value = settings?.Decal ?? "";
	return ElementCreate({
		tag: "div",
		children: [
			{
				tag: "label",
				classList: ["chat-room-map-view-dialog-control"],
				children: [{ tag: "span", children: [TextGet("ObjectSettingsDecal")] }, select],
			},
			colors,
		],
	});
}
