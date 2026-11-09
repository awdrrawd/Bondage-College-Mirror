"use strict";

// The color tool of the map editor's object settings: the color rows of the object window, the color picker for each layer,
// and copying an object's colors to paste them on other objects

/** @type {"Edit" | "Paste"} */
var ChatRoomMapViewColorTool = "Edit";
/** @type {ChatRoomMapColorFormat | null} */
var ChatRoomMapViewColorFormat = null;
/** @type {null | (() => void)} - Restores the layer color when the open color picker is left without accepting */
var ChatRoomMapViewColorPickerCancel = null;
/** @type {null | { Index: number, Colors: HexColor[] }} - The colors shown on an object while its color dialog is being edited */
var ChatRoomMapViewColorPreview = null;

/**
 * Closes the color picker and drops the colors previewed on the map
 * @returns {void}
 */
function ChatRoomMapViewEndColorEditing() {
	ChatRoomMapViewCloseColorPicker();
	ChatRoomMapViewColorPreview = null;
}

/**
 * Gets the name shown for a layer of a map object; the plain image's layer has no name of its own
 * @param {ChatRoomMapLayer} layer
 * @returns {string}
 */
function ChatRoomMapViewGetLayerDisplayName(layer) {
	return layer.Name || TextGet("ObjectSettingsColor");
}

/**
 * Converts the colors picked for each color layer into the stored format, where default colors are kept as "Default"
 * @param {readonly ChatRoomMapColorableLayer[]} layers
 * @param {readonly string[]} colors
 * @returns {NonNullable<ChatRoomMapObjectSettings["Colors"]>}
 */
function ChatRoomMapViewToStoredColors(layers, colors) {
	return layers.map((layer, i) => {
		const color = colors[i]?.toUpperCase();
		return !color || color === layer.DefaultColor.toUpperCase() ? "Default" : /** @type {HexColor} */ (color);
	});
}

/**
 * Normalizes a typed HEX color to `#RRGGBB`
 * @param {string} value
 * @returns {HexColor | null} - The color, or `null` if the value is not a valid 6 digits HEX color
 */
function ChatRoomMapViewParseHexColor(value) {
	let color = value.trim();
	if (!color.startsWith("#")) color = "#" + color;
	return CommonIsColor(color) && color.length === 7 ? /** @type {HexColor} */ (color.toUpperCase()) : null;
}

/**
 * Opens the color picker used for clothes on one color layer
 * @param {string} heading
 * @param {ChatRoomMapColorableLayer} layer
 * @param {HexColor} original - The color of the layer when the picker opens, restored on Cancel
 * @param {(color: HexColor, accepted?: boolean) => void} onPick - Called with the color being picked, with the original one on Cancel,
 * and with `accepted` set when the picker is left with Accept
 */
function ChatRoomMapViewPickLayerColor(heading, layer, original, onPick) {
	ChatRoomMapViewCloseColorPicker();
	/** @type {(state: null | Pick<ItemColorExitState, "colors">) => null | HexColor} */
	const toColor = (state) => {
		const color = state?.colors[0];
		if (color === "Default") return layer.DefaultColor;
		return color ? ChatRoomMapViewParseHexColor(color) : null;
	};
	const cancel = () => onPick(original);
	ChatRoomMapViewColorPickerCancel = cancel;
	if (ChatRoomMapViewColorPicker) ChatRoomMapViewColorPickerToggle();
	// A hidden picker keeps the `onInput` it was created with, so it is created anew for each layer
	ColorPickerExit(true);
	ChatRoomMapViewColorPickerToggle({
		colorState: { colors: [original], defaultColors: [layer.DefaultColor], opacity: [1], editOpacity: false },
		heading: `${heading} - ${ChatRoomMapViewGetLayerDisplayName(layer)}`,
		onInput: (fieldset) => {
			const color = toColor(ColorPicker.getColor(fieldset.closest(".screen") ?? fieldset));
			if (color && ChatRoomMapViewColorPickerCancel === cancel) onPick(color);
		},
		onExit: (state, save) => {
			if (ChatRoomMapViewColorPickerCancel !== cancel) return;
			ChatRoomMapViewColorPickerCancel = null;
			const color = save ? toColor(state) : null;
			onPick(color ?? original, !!color);
		},
	});
}

/**
 * Closes the color picker of a color layer, if open
 * @param {boolean} [keep] - Keep the color being picked instead of restoring the color the layer had before
 * @returns {void}
 */
function ChatRoomMapViewCloseColorPicker(keep = false) {
	const cancel = ChatRoomMapViewColorPickerCancel;
	if (!cancel) return;
	ChatRoomMapViewColorPickerCancel = null;
	if (!keep) cancel();
	if (ChatRoomMapViewColorPicker) ChatRoomMapViewColorPickerToggle();
	ColorPickerExit(true);
}

/**
 * Creates the color rows of the color dialog: a swatch opening the color picker and a HEX field for each layer
 * @param {string} heading - The heading of the color picker
 * @param {readonly ChatRoomMapColorableLayer[]} layers
 * @param {readonly HexColor[]} colors - The current color of each layer
 * @param {() => void} [onChange] - Called whenever a valid color is picked
 * @param {() => void} [onCommit] - Called when a color is confirmed, with Accept in the color picker or by leaving the HEX field
 * @returns {{ element: HTMLElement, getColors: () => HexColor[], setColors: (colors: readonly HexColor[]) => void }}
 */
function ChatRoomMapViewCreateColorRows(heading, layers, colors, onChange, onCommit) {
	/** @type {HexColor[]} */
	const current = [...colors];
	const swatches = layers.map((layer, i) => /** @type {HTMLButtonElement} */ (ElementCreate({
		tag: "button",
		classList: ["chat-room-map-view-dialog-color-swatch"],
		attributes: { type: "button", "aria-label": ChatRoomMapViewGetLayerDisplayName(layer) },
		style: { "background-color": current[i] },
		eventListeners: {
			click: () => ChatRoomMapViewPickLayerColor(heading, layer, current[i], (color, accepted) => {
				setColor(i, color);
				onChange?.();
				if (accepted) onCommit?.();
			}),
		},
	})));
	const hexFields = layers.map((layer, i) => /** @type {HTMLInputElement} */ (ElementCreate({
		tag: "input",
		classList: ["chat-room-map-view-dialog-color-hex"],
		attributes: { type: "text", value: current[i].toUpperCase(), maxlength: "7", spellcheck: "false", autocomplete: "off", "aria-label": ChatRoomMapViewGetLayerDisplayName(layer) },
	})));

	/** @type {(i: number, color: HexColor) => void} */
	const setColor = (i, color) => {
		current[i] = color;
		swatches[i].style.backgroundColor = color;
		hexFields[i].value = color;
		hexFields[i].classList.remove("chat-room-map-view-dialog-color-hex-invalid");
	};

	layers.forEach((_, i) => {
		hexFields[i].addEventListener("input", () => {
			const color = ChatRoomMapViewParseHexColor(hexFields[i].value);
			hexFields[i].classList.toggle("chat-room-map-view-dialog-color-hex-invalid", !color);
			if (!color) return;
			current[i] = color;
			swatches[i].style.backgroundColor = color;
			onChange?.();
		});
		hexFields[i].addEventListener("change", () => {
			setColor(i, current[i]);
			onCommit?.();
		});
	});

	const element = ElementCreate({
		tag: "div",
		classList: ["chat-room-map-view-dialog-color-list"],
		children: layers.map((layer, i) => ({
			tag: "div",
			classList: ["chat-room-map-view-dialog-color-row"],
			children: [
				{ tag: "span", classList: ["chat-room-map-view-dialog-color-name"], children: [ChatRoomMapViewGetLayerDisplayName(layer)] },
				swatches[i],
				hexFields[i],
			],
		})),
	});

	return {
		element,
		getColors: () => [...current],
		setColors: (newColors) => newColors.forEach((color, i) => setColor(i, color)),
	};
}

/**
 * Creates a text button for the color dialog footer
 * @param {string} text
 * @param {() => void} onClick
 * @returns {HTMLButtonElement}
 */
function ChatRoomMapViewCreateColorButton(text, onClick) {
	return /** @type {HTMLButtonElement} */ (ElementCreate({
		tag: "button",
		classList: ["chat-room-map-view-dialog-color-button"],
		attributes: { type: "button" },
		children: [text],
		eventListeners: { click: onClick },
	}));
}

/**
 * Creates the color rows of the object placed on a tile, with the buttons copying its colors to other objects and resetting them
 * @param {ChatRoomMapPos} pos
 * @param {ChatRoomMapObject} object - An object with color layers
 * @returns {HTMLElement}
 */
function ChatRoomMapViewCreateObjectColors(pos, object) {
	const layers = MapGetColorableLayers(object);
	const index = MapCoordinatesToIndex(pos.X, pos.Y);
	/** @type {(colors: NonNullable<ChatRoomMapObjectSettings["Colors"]>) => void} */
	const save = (colors) => {
		ChatRoomMapViewColorPreview = null;
		const saved = ChatRoomMapViewToStoredColors(layers, MapGetObjectLayerColors(pos, object));
		if (colors.every((color, i) => color === saved[i])) return;
		ChatRoomMapViewSaveObjectColors(pos, object, colors);
	};
	const rows = ChatRoomMapViewCreateColorRows(ChatRoomMapViewGetObjectDisplayName(object), layers, MapGetObjectLayerColors(pos, object), () => {
		ChatRoomMapViewColorPreview = { Index: index, Colors: rows.getColors() };
	}, () => save(ChatRoomMapViewToStoredColors(layers, rows.getColors())));

	return ElementCreate({
		tag: "div",
		classList: ["chat-room-map-view-dialog-color-list"],
		children: [
			rows.element,
			{
				tag: "div",
				classList: ["chat-room-map-view-dialog-color-buttons"],
				children: [
					ChatRoomMapViewCreateColorButton(TextGet("EditorColorPasteFormat"), () => {
						ChatRoomMapViewCloseColorPicker(true);
						ChatRoomMapViewColorFormat = { ObjectID: object.ID, Colors: ChatRoomMapViewToStoredColors(layers, rows.getColors()) };
						ChatRoomMapViewStartColorPaste();
					}),
					ChatRoomMapViewCreateColorButton(TextGet("EditorColorReset"), () => {
						ChatRoomMapViewCloseColorPicker(true);
						rows.setColors(layers.map(layer => layer.DefaultColor));
						save(layers.map(() => "Default"));
					}),
				],
			},
		],
	});
}

/**
 * Enters the paste mode: every click on an object with the same ID as the copied format applies it,
 * and the dialog edits the copied format itself.
 * @returns {void}
 */
function ChatRoomMapViewStartColorPaste() {
	const format = ChatRoomMapViewColorFormat;
	const object = format ? MapGetDoodad("Object", format.ObjectID) : null;
	const layers = MapGetColorableLayers(object);
	if (!format || !object || !layers.length) return;

	ChatRoomMapViewColorTool = "Paste";

	const colors = layers.map((layer, i) => {
		const color = format.Colors[i];
		return color && color !== "Default" ? color : layer.DefaultColor;
	});
	const title = `${TextGet("EditorColorPasteTitle")} ${ChatRoomMapViewGetObjectDisplayName(object)}`;
	const rows = ChatRoomMapViewCreateColorRows(title, layers, colors, () => {
		format.Colors = ChatRoomMapViewToStoredColors(layers, rows.getColors());
	});

	ChatRoomMapViewShowDialogMenu(title, rows.element, ElementCreate({
		tag: "div",
		classList: ["chat-room-map-view-dialog-color-buttons"],
		children: [
			ChatRoomMapViewCreateColorButton(TextGet("EditorColorStopPaste"), () => ChatRoomMapViewStopColorPaste()),
		],
	}));
}

/**
 * Leaves the paste mode and closes its dialog
 * @returns {void}
 */
function ChatRoomMapViewStopColorPaste() {
	if (ChatRoomMapViewColorTool !== "Paste") return;
	ChatRoomMapViewColorTool = "Edit";
	ChatRoomMapViewHideDialogMenu();
}

/**
 * Applies the copied color format to the object on a cell, if it is compatible with the object the format was copied from
 * @param {number} x
 * @param {number} y
 * @returns {boolean} - TRUE if the format was applied
 */
function ChatRoomMapViewPasteColorFormat(x, y) {
	const object = MapManager.Map.getObject(x, y);
	const format = ChatRoomMapViewColorFormat;
	if (!format || !object || !MapCanPasteColorFormat(format, object) || !ChatRoomPlayerIsAdmin()) return false;
	ChatRoomMapViewSaveObjectColors({ X: x, Y: y }, object, format.Colors);
	return true;
}

/**
 * Saves the colors of the object placed on a tile and sends the changed map to the room
 * @param {ChatRoomMapPos} pos
 * @param {ChatRoomMapObject} object
 * @param {NonNullable<ChatRoomMapObjectSettings["Colors"]>} colors
 * @returns {void}
 */
function ChatRoomMapViewSaveObjectColors(pos, object, colors) {
	if (!ChatRoomPlayerIsAdmin() || MapManager.Map.getObjectId(pos.X, pos.Y) !== object.ID) return;
	MapManager.Map.setObjectSettings(pos.X, pos.Y, { Colors: colors });
	MapManager.Map.updateGlobalMapData();
}

/**
 * Resets the Color tool to its default state, leaving the paste mode
 * @returns {void}
 */
function ChatRoomMapViewResetColorTool() {
	ChatRoomMapViewColorTool = "Edit";
}
