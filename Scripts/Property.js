/* eslint-disable jsdoc/valid-types */
"use strict";

/**
 * Property.js
 * -----------
 * A module with common helper functions for the handling of specific {@link ItemProperties} properties.
 * Note that more generic extended item functions should be confined to `ExtendedItem.js`.
 */

/**
 * A Map that maps input element IDs to their original value is defined in, _.e.g_, {@link PropertyOpacityLoad}.
 * Used as fallback in case an invalid opacity value is encountered when exiting.
 * @type {Map<string, any>}
 */
const PropertyOriginalValue = new Map([]);

/**
 * Construct an item-specific ID for a properties input element (_e.g._ an opacity slider).
 * @param {string} Name - The name of the input element
 * @param {Item | null} Item - The item for whom the ID should be constructed; defaults to {@link DialogFocusItem}
 * @returns {string} - The ID of the property
 */
function PropertyGetID(Name, Item=DialogFocusItem) {
	if (!Item) return "";
	return `${Item.Asset.Group.Name}${Item.Asset.Name}${Name}`;
}

/**
 * Throttled callback for opacity slider changes
 * @param {Character} C - The character being modified
 * @param {Item} item - The item being modified
 * @param {number} Opacity - The new opacity to set on the item
 * @returns {void} - Nothing
 */
const PropertyOpacityChange = CommonLimitFunction((C, Item, Opacity) => {
	if (Array.isArray(Item.Property.Opacity)) {
		for (const [i, layer] of Item.Asset.Layer.entries()) {
			Item.Property.Opacity[i] = CommonClamp(Opacity, layer.MinOpacity, layer.MaxOpacity);
		}
	} else {
		Item.Property.Opacity = Opacity;
	}
	CharacterLoadCanvas(C);
});

/** @type {ExtendedItemScriptHookCallbacks.Init<ExtendedItemData<any>>} */
function PropertyOpacityInit({ asset }, originalFunction, C, item, push=true, refresh=true) {
	if (!CommonIsObject(item.Property)) {
		item.Property = {};
	}

	// Abort prematurely if all opacity values are within bounds; no need for any refreshes or pushes as nothing was changed
	const opacity = item.Property.Opacity;
	if (CommonIsFinite(opacity) && item.Asset.Layer.every(l => CommonClamp(opacity, l.MinOpacity, l.MaxOpacity) === opacity)) {
		return originalFunction?.(C, item, push, refresh) ?? false;
	} else if (
		CommonIsArray(opacity)
		&& opacity.length === asset.Layer.length
		&& opacity.every((o, i) => CommonIsFinite(o, asset.Layer[i].MinOpacity, asset.Layer[i].MaxOpacity))
	) {
		return originalFunction?.(C, item, push, refresh) ?? false;
	}

	// Illegal or uninitialized opacity value; restore a valid default and perform the whole push + refresh dance
	item.Property.Opacity = asset.Layer.map(l => l.Opacity);

	if (originalFunction) originalFunction(C, item, false, false);
	if (refresh) CharacterRefresh(C, push, false);
	if (push) ChatRoomCharacterItemUpdate(C, asset.Group.Name);
	return true;
}

/**
 * Load function for items with opacity sliders. Constructs the opacity slider.
 * @param {ExtendedItemData<any>} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @param {ThumbIcon} thumbIcon The icon to use for the range input's "thumb" (handle).
 * @returns {HTMLInputElement} - The new or pre-existing range input element of the opacity slider
 * @satisfies {ExtendedItemScriptHookCallbacks.Load<ExtendedItemData<any>>}
 */
function PropertyOpacityLoad({ asset, dialogPrefix }, OriginalFunction, thumbIcon="blindfold") {
	OriginalFunction();
	const ID = PropertyGetID("Opacity");

	if (!PropertyOriginalValue.has(ID) && DialogFocusItem?.Property?.Opacity) {
		PropertyOriginalValue.set(ID, DialogFocusItem.Property.Opacity);
	}

	/** @type {number | number[] | undefined} */
	const propertyOpacity = DialogFocusItem?.Property?.Opacity;
	const opacityValue = CommonIsArray(propertyOpacity) && CommonIsNumeric(propertyOpacity[0])
			? propertyOpacity[0]
			: (/** @type {number} */ (propertyOpacity ?? 1));
	const opacity = CommonClamp(opacityValue, 0, 1);
	const minOpacity = Math.min(...asset.Layer.map(l => l.MinOpacity));
	const maxOpacity = Math.max(...asset.Layer.map(l => l.MaxOpacity));
	const opacitySlider = ElementCreateRangeInput(
		ID,
		opacity,
		minOpacity,
		maxOpacity,
		0.01,
		thumbIcon,
	);

	if (opacitySlider) {
		const C = CharacterGetCurrent();
		opacitySlider.addEventListener("input", (e) => PropertyOpacityChange(C, DialogFocusItem, Number(/** @type {HTMLInputElement} */ (e.target).value)));
		return opacitySlider;
	} else {
		return /** @type {HTMLInputElement} */(document.getElementById(ID));
	}
}

/**
 * Draw function for items with opacity sliders. Draws the opacity slider and further opacity-related information.
 * @param {ExtendedItemData<any>} Data - The items extended item data
 * @param {() => void} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @param {number} XOffset - An offset for all text and slider X coordinates
 * @param {number} YOffset - An offset for all text and slider Y coordinates
 * @param {TextKeysInterface} LabelKeyword - The keyword of the opacity label
 * @returns {void} Nothing
 * @satisfies {ExtendedItemScriptHookCallbacks.Draw<ExtendedItemData<any>>}
 */
function PropertyOpacityDraw(Data, OriginalFunction, XOffset=0, YOffset=0, LabelKeyword="OpacityLabel") {
	OriginalFunction();
	const ID = PropertyGetID("Opacity");

	MainCanvas.textAlign = "right";
	DrawTextFit(
		InterfaceTextGet(LabelKeyword), 1375 + XOffset, 450 + YOffset,
		400, "#FFFFFF", "#000",
	);
	ElementPosition(ID, 1625 + XOffset, 450 + YOffset, 400);
	/** @type {number | number[] | undefined} */
	const propertyOpacity = DialogFocusItem?.Property?.Opacity;
	const opacityValue = CommonIsArray(propertyOpacity) && CommonIsNumeric(propertyOpacity[0])
			? propertyOpacity[0]
			: (/** @type {number} */ (propertyOpacity ?? 1));
	const opacity = CommonClamp(opacityValue, 0, 1);
	DrawTextFit(
		`${Math.round(opacity * 100)}%`, 1925 + XOffset, 450 + YOffset,
		400, "#FFFFFF", "#000",
	);
	MainCanvas.textAlign = "center";
}

/**
 * Exit function for items with opacity sliders. Updates the items opacity, deletes the slider and (optionally) refreshes the character and item.
 * @param {ExtendedItemData<any>} Data - The items extended item data
 * @param {null | (() => void)} OriginalFunction - The function that is normally called when an archetypical item reaches this point (if any).
 * @param {boolean} Refresh - Whether character parameters and the respective item should be refreshed or not
 * @returns {boolean} Whether the opacity was updated or not
 * @satisfies {ExtendedItemScriptHookCallbacks.Exit<ExtendedItemData<any>>}
 */
function PropertyOpacityExit({ asset }, OriginalFunction, Refresh=true) {
	if (OriginalFunction != null) {
		OriginalFunction();
	}

	const ID = PropertyGetID("Opacity");
	const C = CharacterGetCurrent();
	if (!C) return false;
	const Opacity = Number(ElementValue(ID));

	// Restore the original opacity if the new opacity is invalid
	const minOpacity = Math.min(...asset.Layer.map(l => l.MinOpacity));
	const maxOpacity = Math.max(...asset.Layer.map(l => l.MaxOpacity));
	if (!(Opacity <= maxOpacity && Opacity >= minOpacity) && DialogFocusItem?.Property) {
		DialogFocusItem.Property.Opacity = PropertyOriginalValue.get(ID);
		ElementRemove(ID);
		PropertyOriginalValue.delete(ID);
		return false;
	}

	// Remove the element after calling `CharacterRefresh`
	// The latter will call `Load`, which would otherwise restore the slider again
	if (Refresh) {
		CharacterRefresh(C, true, false);
		ChatRoomCharacterItemUpdate(C, asset.Group.Name);
	}
	ElementRemove(ID);
	PropertyOriginalValue.delete(ID);
	return true;
}

/**
 * Helper fuction for publishing shock-related actions.
 * @param {Character} C - The shocked character; defaults to the {@link CharacterGetCurrent} output
 * @param {Item} Item - The shocking item; defaults to {@link DialogFocusItem}
 * @param {boolean} Automatic - Whether the shock was triggered automatically or otherwise manually
 */
function PropertyShockPublishAction(C, Item, Automatic=false) {
	if (!C || !Item) return;

	// Get item-specific properties and choose a suitable default if absent
	const ShockLevel = (Item?.Property?.ShockLevel != null) ? Item.Property.ShockLevel : 1;
	const ShowText = (Item?.Property?.ShowText != null) ? Item.Property.ShowText : true;
	if (Item?.Property?.TriggerCount != null) {
		Item.Property.TriggerCount++;
	}

	if (C.ID === Player.ID) {
		// The Player shocks herself
		ActivityArousalItem(C, C, Item.Asset);
	}
	InventoryShockExpression(C);

	const Dictionary = new DictionaryBuilder()
		.destinationCharacterName(C)
		.asset(Item.Asset, "AssetName", Item.Craft && Item.Craft.Name)
		.shockIntensity(ShockLevel * 1.5)
		.focusGroup(Item.Asset.Group.Name)
		.if(Automatic)
		.markAutomatic()
		.endif()
		.build();

	const ActionTag = `TriggerShock${ShockLevel}`;

	// Manually play audio and flash the screen when not in a chatroom
	if (CurrentScreen !== "ChatRoom") {
		AudioPlaySoundEffect("Shocks", 3 + (3 * ShockLevel));
		if (C.ID === Player.ID) {
			const duration = (Math.random() + ShockLevel * 1.5) * 500;
			DrawFlashScreen("#FFFFFF", duration, 500);
		}
	}

	// Publish the action, be it either quietly or not
	if (ShowText && CurrentScreen === "ChatRoom") {
		ChatRoomPublishCustomAction(ActionTag, false, Dictionary);
	} else if (CurrentScreen === "ChatRoom") {
		ChatRoomMessage({ Content: ActionTag, Type: "Action", Sender: Player.MemberNumber, Dictionary: Dictionary });
	}

	// Exit the dialog menu when triggering a manual shock
	if (!Automatic) {
		ExtendedItemCustomExit(ActionTag);
	}
}

/**
 * A set of group names whose auto-punishment has successfully been handled by {@link PropertyAutoPunishDetectSpeech}.
 * If a group name is absent from the set then it's eligible for action-based punishment triggers.
 * The initial set is populated by {@link AssetLoadAll} after all asset groups are defined.
 * @type {Set<AssetGroupName>}
 */
let PropertyAutoPunishHandled = new Set();

/**
 * A set with the names of all activities as performed by the player.
 * Functions as a cache for {@link PropertyPunishActivityCheck} and can be automatically emptied out by the latter.
 * @type {Set<ActivityName>}
 */
let PropertyPunishActivityCache = new Set();

/**
 * A list of keywords that can trigger automatic punishment when included in `/me`- or `*`-based messages
 * @type {readonly string[]}
 */
const PropertyAutoPunishKeywords = [
	"moan",
	"whimper",
	"shout",
	"scream",
	"whine",
	"growl",
	"laugh",
	"giggle",
	"mutter",
	"stutter",
	"stammer",
	"grunt",
	"hiss",
	"screech",
	"bark",
	"mumble",
];

/**
 * Check if a given message warants automatic punishment given the provided sensitivety level
 * @param {0 | 1 | 2 | 3} Sensitivity - The auto-punishment sensitivety
 * @param {string} msg - The to-be checked message
 * @returns {boolean} Whether the passed message should trigger automatic speech-based punishment
 */
function PropertyAutoPunishParseMessage(Sensitivity, msg) {
	// Remove the OOC component(s) from the message, as those are never punishable
	const oocRanges = SpeechGetOOCRanges(msg).reverse();
	const arrayMsg = Array.from(msg);
	oocRanges.forEach(({ start, length }) => arrayMsg.splice(start, length));
	msg = arrayMsg.join("");

	// Conditions that are always punishable
	const PunishableSpeech = (
		msg.includes('!')
		|| msg.includes('！')
		|| (msg === msg.toUpperCase() && msg !== msg.toLowerCase())
	);

	// Check for sensitivity-specific conditions
	let PunishableKeywords = false;
	switch (Sensitivity) {
		case 1:
			return (
				!msg.startsWith("*")
				&& !msg.startsWith("/")
				&& (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') !== msg && PunishableSpeech)
			);
		case 2:
			return (
				!msg.startsWith("*")
				&& !msg.startsWith("/")
				&& (
					msg.length > 25
					|| (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') !== msg && PunishableSpeech)
				)
			);
		case 3:
			PunishableKeywords = PropertyAutoPunishKeywords.some((k) => msg.includes(k));
			if (PunishableKeywords && (msg.startsWith("/me") || msg.startsWith("*"))) {
				return true;
			}

			return (
				!msg.startsWith("*")
				&& !msg.startsWith("/")
				&& (msg.replace(/[^\p{P} ~+=^$|\\<>`]+/ug, '') !== msg || PunishableSpeech)
			);
		default:
			return false;
	}
}

/**
 * Check whether the last uttered message should trigger automatic punishment from the provided item
 * @param {Item} Item - The item in question
 * @param {number | null} LastMessageLen - The length of {@link ChatRoomLastMessage} prior to the last message (if applicable)
 * @returns {boolean} Whether the last message should trigger automatic speech-based punishment
 */
function PropertyAutoPunishDetectSpeech(Item, LastMessageLen=null) {
	const GroupName = Item.Asset.Group.Name;
	const GagAction = !PropertyAutoPunishHandled.has(GroupName);
	PropertyAutoPunishHandled.add(GroupName);

	// Abort the item does not have `AutoPunish` set
	if (!Item.Property || !Item.Property.AutoPunish) {
		return false;
	}

	// Gag actions at maximum `AutoPunish` values always inflate
	if (Item.Property.AutoPunish === 3 && GagAction) {
		return true;
	}

	// Abort on whispers or if no new messages have been submitted
	if (ChatRoomTargetMemberNumber >= 0 || !ChatRoomLastMessage || ChatRoomLastMessage.length === LastMessageLen) {
		return false;
	}

	const msg = ChatRoomLastMessage[ChatRoomLastMessage.length - 1];
	return PropertyAutoPunishParseMessage(Item.Property.AutoPunish, msg);
}

/**
 * Check if the player character has performed one or more of the passed activities ever since the last {@link PropertyPunishActivityNames} refresh.
 * @param {null | ActivityName | readonly ActivityName[]} name - The name(s) of the activity to check. If `null`, check if any activity at all is present
 * @param {boolean} clearCache - Whether to automatically remove `name` from the {@link PropertyPunishActivityNames} cache.
 * `name == null` implies that all entries should be removed.
 * @returns {boolean}
 */
function PropertyPunishActivityCheck(name=null, clearCache=true) {
	/** @type {boolean} */
	let punish;
	if (typeof name === "string") {
		punish = PropertyPunishActivityCache.has(name);
		if (clearCache) { PropertyPunishActivityCache.delete(name); }
	} else if (CommonIsArray(name)) {
		punish = name.some(PropertyPunishActivityCache.has);
		if (clearCache) { name.forEach(PropertyPunishActivityCache.delete); }
	} else {
		punish = PropertyPunishActivityCache.size > 0;
		if (clearCache) { PropertyPunishActivityCache.clear(); }
	}
	return punish;
}

/**
 * Assign a property on an {@link ItemProperties} record via dynamic key.
 * @template {ItemProperties} T
 * @template {keyof T} K
 * @param {T} output
 * @param {K} key
 * @param {T[K]} value
 */
function PropertyAssign(output, key, value) {
	output[key] = value;
}

/**
 * Merge all passed item properties into the passed output, merging (and shallow copying) arrays if necessary.
 * @deprecated Use {@link ItemPropertiesUnion} instead
 * @param {ItemProperties} output - The to be updated properties
 * @param {readonly ItemProperties[]} args - The additional item properties to be merged into the output
 * @returns {ItemProperties} - The passed output modified inplace
 */
function PropertyUnion(output, ...args) {
	return output;
}

/**
 * Remove all passed item properties from the passed output, removing (and shallow copying) array entries if necessary.
 * @deprecated Use {@link ItemPropertiesDifference} instead
 * @param {ItemProperties} output - The to-be updated properties
 * @param {readonly ItemProperties[]} args - The additional item properties to be removed from the output
 * @returns {ItemProperties} - The passed output modified inplace
 */
function PropertyDifference(output, ...args) {
	return output;
}

/**
 * Convert the passed type record into a list of stringified key/value pairs.
 * @param {TypeRecord} typeRecord
 * @returns {string[]}
 */
function PropertyTypeRecordToStrings(typeRecord) {
	return Object.entries(typeRecord).map(([i, j]) => `${i}${j}`);
}

/**
 * @namespace
 * Namespace with helper functions for managing {@link ItemProperties["DrawingLeft"]}/{@link ItemProperties["DrawignTop"]} data.
 */
var PropertyLayerOrigin = {
	/**
	 * Resolve the `Left/Top` data for the specified item, including any {@link ItemProperties}-based corrections.
	 * @param {Item} item
	 * @param {"DrawingTop" | "DrawingLeft"} fieldName
	 * @returns {Partial<Record<LayerName, Mutable<TopLeft.Data>>>}
	 */
	resolveItem: function resolveItem(item, fieldName) {
		return Object.fromEntries(item.Asset.Layer.map(l => [l.Name ?? "", PropertyLayerOrigin.resolveLayer(l, fieldName, item.Property)]));
	},

	/**
	 * Resolve the `Left/Top` data for the specified layer, including any {@link ItemProperties}-based corrections.
	 * @param {AssetLayer} layer
	 * @param {"DrawingTop" | "DrawingLeft"} fieldName
	 * @param {null | ItemProperties} properties
	 * @returns {Mutable<TopLeft.Data>}
	 */
	resolveLayer: function resolveLayer(layer, fieldName, properties=null) {
		const layerName = layer.Name ?? "";
		/** @type {Mutable<TopLeft.Data>} */
		const ret = { ...layer[fieldName] };

		const extendedData = properties?.[fieldName];
		const extendedOverride = extendedData?.[AssetOverride];
		if (extendedData) {
			if (extendedData[layerName]) {
				CommonAssign(ret, extendedData[layerName]);
			} else if (extendedOverride) {
				CommonKeys(ret).forEach((poseName) => ret[poseName] += (extendedOverride[poseName] ?? 0));
			}
		}
		return ret;
	},

	/**
	 * Get the item's original `Left/Top` data as determined by its layer- and extended item data; any user-made alterations are removed.
	 * @param {Item} item
	 * @param {"DrawingTop" | "DrawingLeft"} fieldName
	 * @returns {Partial<Record<LayerName, Mutable<TopLeft.Data>>>}
	 */
	getOriginal: function getOriginal(item, fieldName) {
		if (item.Asset.Extended && item.Property?.TypeRecord) {
			const itemOriginal = AppearanceItem.fromAsset(item.Asset);
			ExtendedItemSetOptionByRecord(Player, itemOriginal, { ...item.Property?.TypeRecord }, { refresh: false });
			return PropertyLayerOrigin.resolveItem(itemOriginal, fieldName);
		} else {
			return PropertyLayerOrigin.resolveItem(item, fieldName);
		}
	},
};

/**
 * @template {keyof ItemProperties} T
 * @implements {ItemProperty.EntryNullable<T>}
 */
class PropertyDataEntry {
	/**
	 * @readonly
	 * @private
	 * @type {Map<keyof ItemProperties, PropertyDataEntry<any>>}
	 */
	static _entries = new Map();

	/**
	 * @readonly
	 * @type {Required<ItemProperty.PropertyMetaData>[T]}
	 */
	metaData;

	/**
	 * @readonly
	 * @type {T}
	 */
	name;

	/**
	 * @private
	 * @type {undefined | ItemProperty.Compress<T>}
	 */
	_compress;

	/**
	 * @private
	 * @type {undefined | ItemProperty.Decompress<T>}
	 */
	_decompress;

	/**
	 * @private
	 * @type {undefined | ItemProperty.Union<T>}
	 */
	_union;

	/**
	 * @private
	 * @type {undefined | ItemProperty.Difference<T>}
	 */
	_difference;

	/**
	 * @private
	 * @type {undefined | ItemProperty.Compare<T>}
	 */
	_compare;

	/**
	 * @private
	 * @type {ItemProperty.Validate<T>}
	 */
	_validate;

	/**
	 * @private
	 * @type {undefined | ItemProperty.IsSubset<T>}
	 */
	_isSubset;

	/**
	 * @param {T} name
	 * @param {ItemProperty.PropertyMetaData[T]} metaData
	 * @param {Omit<ItemProperty.Entry<T>, "metaData">} functions
	 */
	constructor(name, metaData, functions) {
		this.name = name;
		this.metaData = /** @type {Required<ItemProperty.PropertyMetaData>[T]} */(metaData ?? {});

		const { compress, decompress, union, difference, compare, validate, isSubset } = functions;
		this._compress = compress;
		this._decompress = decompress;
		this._union = union;
		this._difference = difference;
		this._compare = compare;
		this._validate = validate;
		this._isSubset = isSubset;
		PropertyDataEntry._entries.set(name, this);
	}

	/**
	 * Compress the passed item property
	 * @param {ItemProperties[T]} property The item property value
	 * @param {ItemProperty.DataBundle} itemData The item data
	 * @param {ItemProperties[T]} [defaults] The default value of the property (if any)
	 * @returns {ItemPropertiesMinimized} The compressed property
	 */
	compress(property, itemData, defaults=undefined) {
		if (property === undefined) {
			return {};
		} else if (this._compress !== undefined) {
			// @ts-expect-error: TS `never` hallucinations
			return this._compress(property, itemData, defaults ?? undefined) ?? {};
		} else if (defaults !== undefined && this.compare(property, defaults, itemData)) {
			return {};
		} else {
			return { [this.name]: property };
		}
	}

	/**
	 * Decompress the passed item property
	 * @param {ItemPropertiesMinimized[T] | ItemProperties[T]} property The item property value. This property value _should_ be compressed though decompressed value _must_ be handled correctly.
	 * @param {ItemProperty.DataBundle} itemData The item data
	 * @returns {ItemProperties} The decompressed property
	 */
	decompress(property, itemData) {
		if (property === undefined) {
			return {};
		} else if (this._decompress === undefined) {
			return { [this.name]: property };
		} else {
			// @ts-expect-error: TS `never` hallucinations
			return this._decompress.call(this, property, itemData) ?? {};
		}
	}

	/**
	 * Property union function.
	 *
	 * By default, properties follow a "first non-nullish entry wins" approach if no property-specific union function is available.
	 * @param {readonly ItemProperties[T][]} properties The to-be merged property values
	 * @param {ItemProperty.DataBundle} itemData The item data
	 * @returns {undefined | ItemProperties[T]} The merged property
	 */
	union(properties, itemData) {
		const propNonNull = properties.filter(i => i !== undefined);
		if (this._union === undefined || propNonNull.length === 0) {
			return propNonNull[0];
		} else {
			const arrayNonEmpty = /** @type {[p0: Required<ItemProperties>[T], ...pN: Required<ItemProperties>[T][]]} */(propNonNull);
			return this._union.call(this, arrayNonEmpty, itemData);
		}
	}

	/**
	 * Property difference function.
	 * @param {readonly ItemProperties[T][]} properties The to-be differenced property values
	 * @param {ItemProperty.DataBundle} itemData The item data
	 * @returns {undefined | ItemProperties[T]} The differenced property
	 */
	difference(properties, itemData) {
		const propNonNull = properties.filter(i => i !== undefined);
		if (propNonNull.length <= 1) {
			return propNonNull[0];
		} else if (this._difference === undefined) {
			return undefined;
		} else {
			const arrayNonEmpty = /** @type {[p0: Required<ItemProperties>[T], p1: Required<ItemProperties>[T], ...pN: Required<ItemProperties>[T][]]} */(propNonNull);
			return this._difference.call(this, arrayNonEmpty, itemData);
		}
	}

	/**
	 * Property comparison function
	 * @param {ItemProperties[T]} prop1 The firs to-be compared property
	 * @param {ItemProperties[T]} prop2 The firs to-be compared property
	 * @param {ItemProperty.DataBundle} itemData The item data
	 * @returns {boolean} whether both properties are equivalent
	 */
	compare(prop1, prop2, itemData) {
		if (prop1 === undefined && prop2 === undefined) {
			return true;
		} else if (prop1 === undefined || prop2 === undefined) {
			return false;
		} else if (this._compare === undefined) {
			return prop1 === prop2;
		} else {
			// @ts-expect-error: TS `never` hallucinations
			return this._compare.call(this, prop1, prop2, itemData);
		}
	}

	/**
	 * Property subset-or-equivalency comparison function
	 * @param {ItemProperties[T]} subProp The firs to-be compared property
	 * @param {ItemProperties[T]} superProp The firs to-be compared property
	 * @param {ItemProperty.DataBundle} itemData The item data
	 * @returns {boolean} whether both properties are equivalent _or_ whether `subProp` represents a property subset of `superProp`
	 */
	isSubset(subProp, superProp, itemData) {
		if (subProp === undefined) {
			// `{ Foo: undefined }` (i.e. `{}`) is a subset of any other object (or is equivalent)
			return true;
		} else if (superProp !== undefined && this._isSubset !== undefined){
			// @ts-expect-error: TS `never` hallucinations
			return this._isSubset.call(this, subProp, superProp, itemData);
		} else if (superProp !== undefined && this._compare !== undefined){
			// @ts-expect-error: TS `never` hallucinations
			return this._compare.call(this, subProp, superProp, itemData);
		} else {
			return subProp === superProp;
		}
	}

	/**
	 * Property comparison function
	 * @param {ItemProperties[T]} prop The firs to-be compared property
	 * @param {ItemProperty.DataBundle} itemData The item data
	 * @param {ItemProperties[T]} [defaults] The default value of the property (if any)
	 * @returns {ItemProperty.ValidationOutput<ItemProperties[T]>} whether both properties are equivalent
	 */
	validate(prop, itemData, defaults=undefined) {
		if (prop === undefined) {
			return { status: "ok", value: undefined };
		} else if (this._validate === undefined) {
			return { status: "criticalError", errorDescription: [`Missing '${this.name}' validator function`] };
		} else {
			// @ts-expect-error: TS `never` hallucinations
			return this._validate.call(this, prop, itemData, defaults);
		}
	}

	/**
	 * Construct a new entry via shallow copying and renaming an existing one.
	 *
	 * Note that both new- and old-entries _must_ have the same property- and metadata types.
	 * @template {keyof ItemProperties} T
	 * @param {keyof ItemProperties} fromName The old property name of the to-be copied entry object
	 * @param {T} toName The new property name
	 * @param {Partial<ItemProperty.Entry<T>>} [override] Override specific entries from the copied data
	 * @returns {PropertyDataEntry<T>} The newly copied entry
	 */
	static copyFrom(fromName, toName, override=undefined) {
		/** @type {undefined | PropertyDataEntry<any>} */
		let entry = PropertyDataEntry._entries.get(/** @type {keyof ItemProperties} */(fromName));
		if (!entry) {
			throw new Error(`Failed to copy unregistered entry "${String(fromName)}"`);
		}

		const kwargs = {
			compress: entry._compress,
			decompress: entry._decompress,
			union: entry._union,
			difference: entry._difference,
			compare: entry._compare,
			isSubset: entry._isSubset,
			validate: entry._validate,
			metaData: entry.metaData,
			...(override ?? {}),
		};
		return new PropertyDataEntry(toName, kwargs.metaData, kwargs);
	}

	/**
	 * Character code offset for excluding ASCII control characters.
	 * @readonly
	 */
	static ASCIIControlOffset = /** @type {const} */(32);

	/**
	 * Compress an object with layer-specific numeric entries into a string.
	 *
	 * The string is of length `<= Asset.Layer.length`,
	 * with the character code of each substring mapping to their layer-specific numeric entry per `charCodeCallback`.
	 *
	 * The utilized UTF16 character code ranges (_i.e._ `uint16`) are as following:
	 * - `[0, 31]` reserved; ASCII control character range. The `0` code is used for padding
	 * - `[32, 2**15 - 1]` positive number range
	 * - `[2**15, 2**15 + 31]` reserved; mirroring the (offsetted) ASCII control character range
	 * - `[2**15 + 32, 2**16 - 1]` negative number range; offset and represented by their absolute value
	 *
	 * Floating point values (defined per {@link PropertyDataEntry.metaData.stepSize}) are represented with a decimal resolution of 0.01,
	 * _i.e._ multiplied by 100 and rounded to the nearest integer.
	 * @param {Partial<Record<LayerName | "", number>>} value The to-be compressed value
	 * @param {Asset} asset The asset
	 * @param {undefined | Partial<Record<LayerName | "", number>>} defaults Layer-specific default values (if any)
	 * @returns {undefined | string} The compressed entries
	 */
	compressNumberRecord(value, asset, defaults) {
		defaults ??= {};
		const { isInteger, defaultNumber: defaultCandidate } = this.metaData;
		const stepSize = (isInteger ?? true) ? 1 : 0.01;
		const valueCompressed = asset.Layer.map(layer => {
			const layerValue = value[layer.Name ?? ""];
			if (!CommonIsFinite(layerValue)) {
				return 0;
			}
			const defaultValue = defaults[layer.Name ?? ""] ?? defaultCandidate ?? 0;
			return layerValue === defaultValue ? 0 : PropertyDataEntry.compressNumber(layerValue, stepSize);
		});
		for (let i = valueCompressed.length; i >= 0; i--) {
			if (!valueCompressed[i]) {
				valueCompressed.splice(i, 1); // Trim trailing 0s
			} else {
				break;
			}
		}
		return valueCompressed.length ? valueCompressed.map(i => String.fromCharCode(i)).join("") : undefined;
	}

	/**
	 * Decompress a string back into an object with layer-specific numeric entries
	 *
	 * The is expected to be string of length `<= Asset.Layer.length`,
	 * with the character code of each substring mapping to their layer-specific numeric entry per `charCodeCallback`.
	 * @param {string} value The to-be decompressed value
	 * @param {Asset} asset The asset
	 * @returns {undefined | Partial<Record<LayerName | "", number>>} The decompressed entries
	 */
	decompressNumberRecord(value, asset) {
		const { isInteger, min, max } = this.metaData;
		const stepSize = (isInteger ?? true) ? 1 : 0.01;
		const ret = asset.Layer.map((layer, layerIndex) => {
			const layerMappedValue = value.charCodeAt(layerIndex);
			if (!layerMappedValue) {
				return undefined;
			}
			const layerValue = CommonClamp(PropertyDataEntry.decompressNumber(layerMappedValue, stepSize), min ?? -Infinity, max ?? Infinity);
			return /** @type {const} */([layer.Name ?? "", layerValue]);
		}).filter(i => i !== undefined);
		return ret.length !== 0 ? CommonFromEntries(ret) : undefined;
	}

	/**
	 * Compress a number into the `uint16` range from `float64`.
	 * @param {number} value
	 * @param {1 | 0.01} [floatResolution]
	 * @returns {number}
	 */
	static compressNumber(value, floatResolution=undefined) {
		floatResolution ??= 1;
		const int16Max = 2**15;
		const extrema = int16Max - PropertyDataEntry.ASCIIControlOffset;
		const valueInt = CommonClamp(Math.round(value / floatResolution), -extrema, extrema - 1);
		if (value < 0) {
			return -valueInt + PropertyDataEntry.ASCIIControlOffset + int16Max;
		} else {
			return valueInt + PropertyDataEntry.ASCIIControlOffset;
		}
	}

	/**
	 * Decompress a number from the `uint16` range into `float64`.
	 * @param {number} value
	 * @param {1 | 0.01} [floatResolution]
	 * @returns {number}
	 */
	static decompressNumber(value, floatResolution=undefined) {
		floatResolution ??= 1;
		const int16Max = 2**15;
		if (value >= int16Max) {
			return -1 * (value - PropertyDataEntry.ASCIIControlOffset - int16Max) * floatResolution;
		} else {
			return (value - PropertyDataEntry.ASCIIControlOffset) * floatResolution;
		}
	}

	/**
	 * Comparison function for set-like arrays
	 * @satisfies {ItemProperty.Compare<keyof ItemProperties>}
	 * @template {string | boolean | number} T
	 * @param {readonly T[]} value1
	 * @param {readonly NoInfer<T>[]} value2
	 * @returns {boolean}
	 */
	static compareSetLikeArrays(value1, value2) {
		return CommonArraysEqual(value1, value2, true);
	}

	/**
	 * Subset checking function for set-like arrays
	 * @satisfies {ItemProperty.IsSubset<any>}
	 * @template {string | boolean | number} T
	 * @param {readonly T[]} subArray
	 * @param {readonly NoInfer<T>[]} superArray
	 * @returns {boolean}
	 */
	static isSubsetSetLikeArrays(subArray, superArray) {
		return subArray.every(i => superArray.includes(i));
	}

	/**
	 * Comparison function for simple objects with scalar values (numbers, strings, etc.)
	 * @satisfies {ItemProperty.Union<keyof ItemProperties>}
	 * @template {string | boolean | number} T
	 * @param {readonly (readonly T[])[]} values
	 * @returns {T[]}
	 */
	static unionSetLikeArrays(values) {
		return Array.from(new Set(values.flat()));
	}

	/**
	 * Return the difference between the passed set-like arrays (unordered and unique elements)
	 * @satisfies {ItemProperty.Difference<any>}
	 * @template {string | boolean | number} T
	 * @param {readonly [p0: readonly T[], ...pN: readonly (readonly T[])[]]} values
	 * @returns {undefined | T[]}
	 */
	static differenceSetLikeArrays(values) {
		const [head, ...tail] = values;
		/** @type {Set<T>} */
		const ret = new Set(head);
		for (const i of tail.flat()) {
			ret.delete(i);
		}
		return ret.size === 0 ? undefined : Array.from(ret);
	}

	/**
	 * Comparison function for simple objects with scalar values (numbers, strings, etc.)
	 * @satisfies {ItemProperty.Compare<keyof ItemProperties>}
	 * @template {Readonly<Record<string, undefined | null | string | boolean | number>>} T
	 * @param {T} value1
	 * @param {Readonly<Record<string, undefined | null | string | boolean | number>>} value2
	 * @returns {value2 is T}
	 */
	static compareShallowObjects(value1, value2) {
		return CommonObjectEqual(value1, value2);
	}

	/**
	 * Comparison function for simple objects with scalar values (numbers, strings, etc.)
	 * @satisfies {ItemProperty.Union<keyof ItemProperties>}
	 * @template {Record<string, undefined | null | string | boolean | number>} T
	 * @param {readonly Readonly<T>[]} values
	 * @returns {T}
	 */
	static unionShallowObjects(values) {
		/** @type {Record<string, undefined | null | string | boolean | number>} */
		const ret = {};
		for (const value of values) {
			if (!CommonIsObject(value)) {
				continue;
			}
			for (const [k, v] of Object.entries(value)) {
				if (v !== undefined) {
					ret[k] ??= v;
				}
			}
		}
		return /** @type {T} */(ret);
	}

	/**
	 * Return the difference between the passed (shallow) objects
	 * @satisfies {ItemProperty.Difference<any>}
	 * @template {Partial<Record<string, ScalarType>>} T
	 * @param {readonly [p0: Readonly<T>, ...pN: readonly Readonly<T>[]]} values
	 * @returns {undefined | T}
	 */
	static differenceShallowObjects(values) {
		const [head, ...tail] = values;
		/** @type {T} */
		const ret = { ...head };
		for (const obj of tail) {
			for (const [k, v] of Object.entries(obj)) {
				if (v === undefined) {
					continue;
				} else if (ret[k] === v) {
					delete ret[k];
				}
			}
		}
		return Object.values(ret).filter(i => i !== undefined).length === 0 ? undefined : ret;
	}

	/**
	 * Validate a scalar value w.r.t. to a reference set of all legal values (see {@link PropertyDataEntry.metaData["valueSet"]}).
	 * @overload
	 * @param {ItemProperty.Extract2<T, ScalarType>} value
	 * @param {Required<ItemProperties>[T]} [defaults]
	 * @param {undefined} [metaData]
	 * @returns {ItemProperty.ValidationOutput<ItemProperty.Extract2<T, ScalarType> | Required<ItemProperties>[T]>}
	 */
	/**
	 * Validate a scalar value w.r.t. to a reference set of all legal values. Reference values are explicitly passed in the metadata.
	 * @template {ScalarType} T2
	 * @overload
	 * @param {T2} value
	 * @param {undefined | NoInfer<T2>} defaults
	 * @param {ItemProperty.MetaData2<NoInfer<T2>>} metaData
	 * @returns {ItemProperty.ValidationOutput<T2>}
	 */
	/**
	 * @param {ScalarType} value The to-be validated value
	 * @param {Required<ItemProperties>[T]} [defaults] The fallback value in case the validation fails
	 * @param {ItemProperty.MetaData2<ScalarType>} [metaData] Custom property metadata; defaults to {@link PropertyDataEntry.metaData}
	 * @returns {ItemProperty.ValidationOutput<ScalarType | Required<ItemProperties>[T]>} The validation output
	 */
	validateAsSetMember(value, defaults, metaData=undefined) {
		/** @type {{ name: string, valueSet?: ReadonlySet<unknown> }} */
		const { name, valueSet } = metaData ?? { name: this.name, ...this.metaData };

		/** @type {string[]} */
		const errorDescription = [];
		/** @type {undefined | number} */
		let ret = undefined;
		if (valueSet === undefined) {
			errorDescription.push(`Missing '${name}' value set`);
		} else if (!valueSet.has(value)) {
			if (typeof value === "string") {
				errorDescription.push(`Invalid '${name}' value '${value}'`);
			} else {
				errorDescription.push(`Invalid '${name}' value ${value}`);
			}
		} else {
			return { status: "ok", value };
		}

		if (ret !== undefined) {
			return { status: "error", value: ret, errorDescription };
		} else if (defaults !== undefined) {
			return { status: "error", value: defaults, errorDescription };
		} else {
			return { status: "criticalError", errorDescription };
		}
	}

	/**
	 * Validate a list of scalar values w.r.t. to a reference set of all legal values (see {@link PropertyDataEntry.metaData["valueSet"]})
	 * @overload
	 * @param {ItemProperty.Extract2<T, ScalarType[]>} value
	 * @param {Required<ItemProperties>[T]} [defaults]
	 * @param {undefined} [metaData]
	 * @returns {ItemProperty.ValidationOutput<ItemProperty.Extract2<T, ScalarType[]> | Required<ItemProperties>[T]>}
	 */
	/**
	 * Validate a list of scalar values w.r.t. to a reference set of all legal values. Reference values are explicitly passed in the metadata.
	 * @template {ScalarType} T2
	 * @overload
	 * @param {T2[]} value
	 * @param {undefined | NoInfer<T2[]>} defaults
	 * @param {ItemProperty.MetaData2<NoInfer<T2>>} metaData
	 * @returns {ItemProperty.ValidationOutput<T2[]>}
	 */
	/**
	 * @param {ScalarType[]} value The to-be validated value
	 * @param {any} [defaults] The fallback value in case the validation fails
	 * @param {ItemProperty.MetaData2<ScalarType>} [metaData] Custom property metadata; defaults to {@link PropertyDataEntry.metaData}
	 * @returns {ItemProperty.ValidationOutput<ScalarType[] | Required<ItemProperties>[T]>} The validation output
	 */
	validateAsLiteralSet(value, defaults, metaData=undefined) {
		/** @type {{ name: string, valueSet?: ReadonlySet<unknown> }} */
		const { name, valueSet } = metaData ?? { name: this.name, ...this.metaData };

		/** @type {string[]} */
		const errorDescription = [];
		/** @type {undefined | ScalarType[]} */
		let ret = undefined;
		if (valueSet === undefined) {
			errorDescription.push(`Missing '${name}' value set`);
		} else if (!CommonIsArray(value)) {
			errorDescription.push(`Invalid '${name}' non-array type '${typeof value}'`);
		} else {
			ret = value.filter((entry, i) => {
				if (valueSet.has(entry)) {
					return true;
				} else {
					if (typeof entry === "string") {
						errorDescription.push(`Illegal '${name}[${i}]' value '${entry}'`);
					} else {
						errorDescription.push(`Illegal '${name}[${i}]' value ${entry}`);
					}
					return false;
				}
			});
		}

		if (ret) {
			if (!errorDescription.length) {
				return { status: "ok", value: ret };
			} else {
				return { status: "error", value: ret, errorDescription };
			}
		} else if (defaults !== undefined) {
			return { status: "error", value: defaults, errorDescription };
		} else {
			return { status: "criticalError", errorDescription };
		}
	}

	/**
	 * Validate a number
	 * @overload
	 * @param {ItemProperty.Extract2<T, number>} value
	 * @param {Required<ItemProperties>[T]} [defaults]
	 * @param {undefined} [metaData]
	 * @returns {ItemProperty.ValidationOutput<ItemProperty.Extract2<T, number> | Required<ItemProperties>[T]>}
	 */
	/**
	 * Validate a number with explicitly passed metadata
	 * @template {number} T2
	 * @template [T3=T2]
	 * @overload
	 * @param {T2} value
	 * @param {undefined | T3} defaults
	 * @param {ItemProperty.MetaData2<NoInfer<T2>>} metaData
	 * @returns {ItemProperty.ValidationOutput<T2 | Exclude<T3, undefined>>}
	 */
	/**
	 * @param {number} value The to-be validated value
	 * @param {Required<ItemProperties>[T]} [defaults] The fallback value in case the validation fails
	 * @param {ItemProperty.MetaData2<number>} [metaData] Custom property metadata; defaults to {@link PropertyDataEntry.metaData}
	 * @returns {ItemProperty.ValidationOutput<number | Required<ItemProperties>[T]>} The validation output
	 */
	validateNumber(value, defaults, metaData=undefined) {
		let { name, min, max, isInteger } = metaData ?? { name: this.name, ...this.metaData };
		min ??= -Infinity;
		max ??= Infinity;
		isInteger ??= true;

		/** @type {string[]} */
		const errorDescription = [];
		/** @type {undefined | T2} */
		let ret = undefined;
		if (typeof value !== "number") {
			errorDescription.push(`Invalid '${name}' type '${typeof value}'`);
		} else if (!Number.isFinite(value)) {
			errorDescription.push(`Invalid '${name}' non-finite value ${value}`);
		} else if (isInteger && !Number.isInteger(value)) {
			errorDescription.push(`Invalid '${name}' integer value ${value}`);
		} else if (value > max || value < min) {
			errorDescription.push(`Invalid '${name}' out of range value ${value} (expected interval [${min}, ${max}])`);
			// @ts-expect-error
			ret = CommonClamp(value, min, max);
		} else {
			return { status: "ok", value };
		}

		if (ret !== undefined) {
			return { status: "error", value: ret, errorDescription };
		} else if (defaults !== undefined) {
			return { status: "error", value: defaults, errorDescription };
		} else {
			return { status: "criticalError", errorDescription };
		}
	}

	/**
	 * Validate a string
	 * @overload
	 * @param {ItemProperty.Extract2<T, string>} value
	 * @param {Required<ItemProperties>[T]} [defaults]
	 * @param {undefined} [metaData]
	 * @returns {ItemProperty.ValidationOutput<ItemProperty.Extract2<T, string> | Required<ItemProperties>[T]>}
	 */
	/**
	 * Validate a string with explicitly passed metadata
	 * @template {string} T2
	 * @template [T3=T2]
	 * @overload
	 * @param {T2} value
	 * @param {undefined | T3} defaults
	 * @param {ItemProperty.MetaData2<NoInfer<T2>>} metaData
	 * @returns {ItemProperty.ValidationOutput<T2 | Exclude<T3, undefined>>}
	 */
	/**
	 * @param {string} value The to-be validated value
	 * @param {Required<ItemProperties>[T]} [defaults] The fallback value in case the validation fails
	 * @param {ItemProperty.MetaData2<string>} [metaData] Custom property metadata; defaults to {@link PropertyDataEntry.metaData}
	 * @returns {ItemProperty.ValidationOutput<string | Required<ItemProperties>[T]>} The validation output
	 */
	validateString(value, defaults, metaData=undefined) {
		const { name, valuePattern: pattern, isColor, colorSchema } = metaData ?? { name: this.name, ...this.metaData };

		/** @type {string[]} */
		const errorDescription = [];
		if (typeof value !== "string") {
			errorDescription.push(`Invalid '${name}' type '${typeof value}'`);
		} else if (pattern !== undefined && !pattern.test(value)) {
			errorDescription.push(`Invalid '${name}' value '${value}' (mismatch w.r.t. '${pattern.source}' pattern)`);
		} else if (isColor && !CommonIsColor(value, { schema: colorSchema ? Array.from(colorSchema) : undefined })) {
			const suffix = colorSchema === undefined ? "invalid hex color" : "invalid BC color";
			errorDescription.push(`Invalid '${name}' value '${value}' (${suffix})`);
		} else {
			return { status: "ok", value };
		}

		if (defaults !== undefined) {
			return { status: "error", value: defaults, errorDescription };
		} else {
			return { status: "criticalError", errorDescription };
		}
	}

	/**
	 * Validate a boolean
	 * @overload
	 * @param {ItemProperty.Extract2<T, boolean>} value
	 * @param {Required<ItemProperties>[T]} [defaults]
	 * @param {undefined} [metaData]
	 * @returns {ItemProperty.ValidationOutput<ItemProperty.Extract2<T, boolean> | Required<ItemProperties>[T]>}
	 */
	/**
	 * Validate a boolean with explicitly passed metadata
	 * @template {boolean} T2
	 * @template [T3=T2]
	 * @overload
	 * @param {T2} value
	 * @param {undefined | T3} defaults
	 * @param {ItemProperty.MetaData2<NoInfer<T2>>} metaData
	 * @returns {ItemProperty.ValidationOutput<T2 | Exclude<T3, undefined>>}
	 */
	/**
	 * @param {boolean} value The to-be validated value
	 * @param {Required<ItemProperties>[T]} [defaults] The fallback value in case the validation fails
	 * @param {ItemProperty.MetaData2<boolean>} [metaData] Custom property metadata; defaults to {@link PropertyDataEntry.metaData}
	 * @returns {ItemProperty.ValidationOutput<boolean | Required<ItemProperties>[T]>} The validation output
	 */
	validateBoolean(value, defaults, metaData=undefined) {
		const { name } = metaData ?? { name: this.name, ...this.metaData };

		/** @type {string[]} */
		const errorDescription = [];
		if (typeof value !== "boolean") {
			errorDescription.push(`Invalid '${name}' type '${typeof value}'`);
		} else {
			return { status: "ok", value };
		}

		if (defaults !== undefined) {
			return { status: "error", value: defaults, errorDescription };
		} else {
			return { status: "criticalError", errorDescription };
		}
	}

	/**
	 * @template {{ type: "boolean", value: boolean } | { type: "number", value: number } | { type: "string", value: string }} T2
	 * @param {{ type: T2["type"], value: ItemProperty.Extract2<T, T2["value"][]> }} value
	 * @param {readonly NoInfer<T2["value"]>[]} [defaults]
	 * @param {ItemProperty.MetaData2<T2["value"]>} [metaData] Custom property metadata; defaults to {@link PropertyDataEntry.metaData}
	 * @returns {ItemProperty.ValidationOutput<ItemProperty.Extract2<T, T2["value"][]>>}
	 */
	validateSetLikeArray(value, defaults, metaData=undefined) {
		// Need an unfortunate amount of casts/ts-ignores here as TS sucks with handling templates
		const { type, value: array } = value;
		if (!CommonIsArray(array)) {
			const errorDescription = [`Invalid '${this.name}' non-array type '${typeof array}'`];
			if (defaults !== undefined) {
				// @ts-ignore
				return { status: "error", value: [...defaults], errorDescription };
			} else {
				return { status: "criticalError", errorDescription };
			}
		}

		/** @type {ItemProperty.ValidationOutput<unknown>[]} */
		let newValue;
		/** @type {ItemProperty.MetaData2<any>} */
		const metadata = metaData ?? { name: this.name, ...this.metaData };
		switch (type) {
			case "number": {
				const numberDefaults = /** @type {undefined | readonly number[]} */(defaults);
				newValue = /** @type {number[]} */(array).map((v, i) => this.validateNumber(v, numberDefaults?.[i], { ...metadata, name: `${metadata.name}[${i}]` }));
				break;
			}
			case "string": {
				const stringDefaults = /** @type {undefined | readonly string[]} */(defaults);
				newValue = /** @type {string[]} */(array).map((v, i) => this.validateString(v, stringDefaults?.[i], { ...metadata, name: `${metadata.name}[${i}]` }));
				break;
			}
			case "boolean": {
				const booleanDefaults = /** @type {undefined | readonly boolean[]} */(defaults);
				newValue = /** @type {boolean[]} */(array).map((v, i) => this.validateBoolean(v, booleanDefaults?.[i], { ...metadata, name: `${metadata.name}[${i}]` }));
				break;
			}
			default:
				throw new Error();
		}
		// @ts-ignore
		return ItemPropertiesMergeValidationOutputs(newValue);
	}
}

/**
 * Preset item property functions for set-like arrays consisting of literal members
 * @private
 * @type {Omit<ItemProperty.Entry<any>, "metaData">}
 */
var _PropertyDataArraysDefaults = {
	compare: PropertyDataEntry.compareSetLikeArrays,
	union: PropertyDataEntry.unionSetLikeArrays,
	difference: PropertyDataEntry.differenceSetLikeArrays,
	isSubset: PropertyDataEntry.isSubsetSetLikeArrays,
	validate(prop, itemData, defaults) { return this.validateAsLiteralSet(prop, defaults); },
};

/**
 * Item property specific metadata and utility functions (compression, validation, merging, _etc._)
 * @type {{ [k in keyof ItemProperties]: PropertyDataEntry<k> }}
 */
var PropertyData = {
	AccessMode: new PropertyDataEntry("AccessMode",
		{ get valueSet() { return this._valueSet ??= new Set(Object.values(ItemVulvaFuturisticVibratorAccessModes)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	// Represents a pretty generic array of unordered & unique scalar elements
	AllowActivePose: new PropertyDataEntry("AllowActivePose",
		{ get valueSet() { return this._valueSet ??= new Set(CommonKeys(PoseRecord)); } },
		{
			..._PropertyDataArraysDefaults,
		},
	),
	AllowActivity: new PropertyDataEntry("AllowActivity",
		{ get valueSet() { return this._valueSet ??= new Set(ActivityFemale3DCG.map(a => a.Name)); } },
		{
			..._PropertyDataArraysDefaults,
		},
	),
	AllowActivityOn: new PropertyDataEntry("AllowActivityOn",
		{ get valueSet() { return this._valueSet ??= new Set(AssetGroup.map(a => a.Name)); } },
		{
			..._PropertyDataArraysDefaults,
		},
	),
	ArousalLvl: new PropertyDataEntry("ArousalLvl",
		{ get valueSet() { return this._valueSet ??= new Set(Object.values(ItemVulvaChastityCageExcitementLevel)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	Attribute: new PropertyDataEntry("Attribute", undefined,
		{
			..._PropertyDataArraysDefaults,
			validate(prop) { return this.validateSetLikeArray({ value: prop, type: "string" }); },
		},
	),
	AutoPunish: new PropertyDataEntry("AutoPunish",
		{ valueSet: new Set(/** @type {const} */([0, 1, 2, 3])) },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	AutoPunishUndoTime: new PropertyDataEntry("AutoPunishUndoTime",
		{ min: 0.0, isInteger: false },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	AutoPunishUndoTimeSetting: new PropertyDataEntry("AutoPunishUndoTimeSetting",
		{ valueSet: new Set(/** @type {const} */([120_000, 300_000, 900_000, 360_000_0, 720_000_00])) },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	BlinkState: new PropertyDataEntry("BlinkState", undefined,
		{
			compress() { return undefined; },  // Local-only property; should never be synced
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	Block: new PropertyDataEntry("Block",
		{ get valueSet() { return this._valueSet ??= new Set(AssetGroup.filter(i => i.IsItem()).map(i => i.Name)); } },
		{
			..._PropertyDataArraysDefaults,
			validate(prop, { asset }, defaults) {
				const valueSet = new Set(asset.AllowBlock ?? []);
				const metaData = { ...this.metaData, name: this.name, valueSet };
				const ret = this.validateAsLiteralSet(prop, defaults, metaData);

				// Always allow 0-length arrays
				if (valueSet.size === 0 && ret.status !== "criticalError" && ret.value.length !== 0) {
					return { status: "criticalError", errorDescription: [`Illegal property '${this.name}'`] };
				} else {
					return ret;
				}
			},
		},
	),
	BlockRemotes: new PropertyDataEntry("BlockRemotes", undefined,
		{
			decompress(prop) {
				return prop ? { BlockRemotes: prop, Effect: ["BlockRemotes"] } : { BlockRemotes: prop };
			},
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	CombinationNumber: new PropertyDataEntry("CombinationNumber",
		{ get valuePattern() { return ValidationCombinationNumberRegex; } },
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	CustomBlindBackground: new PropertyDataEntry("CustomBlindBackground",
		{ get valueSet() { return this._valueSet ??= new Set(["", ...BackgroundsList.map(i => i.Name)]); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	DefaultColor: new PropertyDataEntry("DefaultColor",
		{ isColor: true },
		{
			validate(prop, { asset }, defaults) {
				const metaData = { ...this.metaData, name: this.name, colorSchema: new Set(asset.Group.ColorSchema) };
				if (typeof prop === "string") {
					return this.validateString(prop, defaults, metaData);
				} else {
					// TODO: Validate as an ordered array
					return this.validateSetLikeArray(
						{ type: "string", value: prop },
						CommonIsArray(defaults) ? defaults : undefined,
						metaData,
					);
				}
			},
		},
	),
	Difficulty: new PropertyDataEntry("Difficulty", undefined,
		{
			union(properties) { return properties.reduce((total, i) => total + i); },
			difference(properties) { return properties.reduce((total, i) => total - i); },
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
			isSubset() { return true; }, // Just return true; subsetting doesn't make sense here with additive properties
		},
	),
	Door: new PropertyDataEntry("Door", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	DrawingLeft: undefined, // TODO: Deprecated property; remove at some point
	DrawingTop: undefined, // TODO: Deprecated property; remove at some point
	Effect: new PropertyDataEntry("Effect", undefined,
		{
			..._PropertyDataArraysDefaults,
			compress(prop, { asset }) {
				/** @type {Mandatory<ItemPropertiesMinimized, "Effect">} */
				const ret = { Effect: /** @type {never} */(undefined) };
				if (asset.AllowEffect?.includes("IsLeashed") && prop.includes("IsLeashed")) {
					ret.IsLeashed = true;
				}
				return ret;
			},
			validate(prop, { asset }, defaults) {
				// TODO: Automatically append `AllowEffect` with the "Lock" effect when appropriate
				const valueSet = new Set(asset.AllowEffect ?? []);
				if (asset.AllowLock) { valueSet.add("Lock"); }

				const metaData = { ...this.metaData, name: this.name, valueSet };
				const ret = this.validateAsLiteralSet(prop, defaults, metaData);

				// Always allow 0-length arrays
				if (valueSet.size === 0 && ret.status !== "criticalError" && ret.value.length !== 0) {
					return { status: "criticalError", errorDescription: [`Illegal property '${this.name}'`] };
				} else {
					return ret;
				}
			},
		},
	),
	EnableRandomInput: new PropertyDataEntry("EnableRandomInput", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	Expression: new PropertyDataEntry("Expression", undefined,
		{
			validate(prop, { asset }, defaults) {
				// TODO: Propagate group-level `AllowExpression` to the asset-level
				if (asset.AllowExpression === undefined && asset.Group.AllowExpression === undefined) {
					return { status: "criticalError", errorDescription: [`Illegal property '${this.name}'`] };
				}

				// TODO: Fix `AllowExpression` lacking a `null` entry
				const valueSet = new Set(asset.AllowExpression ?? asset.Group.AllowExpression ?? []);
				valueSet.add(null);

				const metaData = { ...this.metaData, name: this.name, valueSet };
				return this.validateAsSetMember(prop, defaults, metaData);
			},
		}
	),
	Fetish: new PropertyDataEntry("Fetish",
		{ get valueSet() { return this._valueSet ??= new Set(FetishFemale3DCG.map(i => i.Name)); } },
		{
			..._PropertyDataArraysDefaults,
		},
	),
	HeartRate: new PropertyDataEntry("HeartRate",
		{ min: 0 },
		{
			compress() { return undefined; },  // Local-only property; should never be synced
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	HeightModifier: new PropertyDataEntry("HeightModifier", undefined,
		{
			union(properties) { return properties.reduce((total, i) => total + i); },
			difference(properties) { return properties.reduce((total, i) => total - i); },
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
			isSubset() { return true; }, // Just return true; subsetting doesn't make sense here with additive properties
		}
	),
	Hide: new PropertyDataEntry("Hide",
		{ get valueSet() { return this._valueSet ??= new Set(AssetGroup.map(a => a.Name)); } },
		{
			..._PropertyDataArraysDefaults,
			validate(prop, { asset }, defaults) {
				const valueSet = new Set(asset.AllowHide ?? []);
				const metaData = { ...this.metaData, name: this.name, valueSet };
				const ret = this.validateAsLiteralSet(prop, defaults, metaData);

				// Always allow 0-length arrays
				if (valueSet.size === 0 && ret.status !== "criticalError" && ret.value.length !== 0) {
					return { status: "criticalError", errorDescription: [`Illegal property '${this.name}'`] };
				} else {
					return ret;
				}
			},
		},
	),
	HideItem: new PropertyDataEntry("HideItem", undefined,
		{
			..._PropertyDataArraysDefaults,
			validate(prop, { asset }, defaults) {
				const valueSet = new Set(asset.AllowHideItem ?? []);
				const metaData = { ...this.metaData, name: this.name, valueSet };
				const ret = this.validateAsLiteralSet(prop, defaults, metaData);

				// Always allow 0-length arrays
				if (valueSet.size === 0 && ret.status !== "criticalError" && ret.value.length !== 0) {
					return { status: "criticalError", errorDescription: [`Illegal property '${this.name}'`] };
				} else {
					return ret;
				}
			},
		},
	),
	HideItemExclude: new PropertyDataEntry("HideItemExclude", undefined,
		{
			..._PropertyDataArraysDefaults,
			validate(prop, itemData, defaults) { return this.validateSetLikeArray({ type: "string", value: prop }); },
		},
	),
	Hint: new PropertyDataEntry("Hint", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	InflateLevel: new PropertyDataEntry("InflateLevel",
		{ valueSet: new Set(/** @type {const} */([0, 1, 2, 3, 4])) },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	InsertedBeads: new PropertyDataEntry("InsertedBeads",
		{ valueSet: new Set(/** @type {const} */([1, 2, 3, 4, 5])) },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	Intensity: new PropertyDataEntry("Intensity",
		{ valueSet: new Set(/** @type {const} */([-1, 0, 1, 2, 3])) },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
			union(values) { return CommonMax(...values); },
		},
	),
	IsLeashed: new PropertyDataEntry("IsLeashed", undefined,
		{
			decompress(prop) {
				return prop ? { IsLeashed: /** @type {never} */(undefined), Effect: ["IsLeashed"] } : undefined;
			},
			validate() {
				// Should only ever be present in item bundles; not regular items
				return { status: "criticalError", errorDescription: [`Illegal property '${this.name}'`] };
			},
		}),
	Iterations: new PropertyDataEntry("Iterations",
		{ min: 0 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	LastShrinkWarningTime: new PropertyDataEntry("LastShrinkWarningTime",
		{ min: 0 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	LayerRotation: new PropertyDataEntry("LayerRotation",
		{ defaultNumber: 0, min: -180, max: 180 },
		{
			compare: PropertyDataEntry.compareShallowObjects,
			union: PropertyDataEntry.unionShallowObjects,
			compress(prop, { asset }, defaults) {
				const value = this.compressNumberRecord(prop, asset, defaults);
				return value ? { [this.name]: value } : undefined;
			},
			decompress(prop, { asset }) {
				if (typeof prop === "string") {
					const value = this.decompressNumberRecord(prop, asset);
					return value ? { [this.name]: value } : undefined;
				} else {
					return { [this.name]: prop };
				}
			},
			validate(prop, { asset }, defaults) {
				if (!CommonIsObject(prop)) {
					return { status: "criticalError", errorDescription: [`Invalid '${this.name}' type '${typeof prop}'`] };
				}

				const keySet = new Set(asset.Layer.map(l => l.Name ?? ""));
				/** @type {Partial<Record<LayerName, ItemProperty.ValidationOutput<number>>>} */
				const propertyOutput = CommonFromEntries(CommonEntries(prop).map(([k, v]) => {
					const metaData = { ...this.metaData, name: `${this.name}["${k}"]` };
					if (v === undefined) {
						return [k, undefined];
					} if (!keySet.has(k)) {
						return [k, { status: "criticalError", errorDescription: [`Invalid '${this.name}' key value '${k}'`] }];
					} else {
						return [k, this.validateNumber(v, defaults?.[k], metaData)];
					}
				}));
				return ItemPropertiesMergeValidationOutputs(propertyOutput);
			}
		},
	),
	LayerScaleX: PropertyDataEntry.copyFrom("LayerRotation", "LayerScaleX",
		{ metaData: { defaultNumber: 1.00, min: 0.01, max: 3.00, isInteger: false } },
	),
	LayerScaleY: PropertyDataEntry.copyFrom("LayerScaleX", "LayerScaleY"),
	LayerTranslationX: PropertyDataEntry.copyFrom("LayerScaleX", "LayerTranslationX",
		{ metaData: { defaultNumber: 0, min: -500, max: 500 } },
	),
	LayerTranslationY: PropertyDataEntry.copyFrom("LayerTranslationX", "LayerTranslationY"),
	LockButt: new PropertyDataEntry("LockButt", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	LockMemberName: new PropertyDataEntry("LockMemberName", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	LockMemberNumber: new PropertyDataEntry("LockMemberNumber", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	LockMessage: new PropertyDataEntry("LockMessage", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	LockPickSeed: new PropertyDataEntry("LockPickSeed", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	LockSet: new PropertyDataEntry("LockSet", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	LockedBy: new PropertyDataEntry("LockedBy",
		{ get valueSet() { return this._valueSet ??= new Set(CommonKeys(AssetLocks)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	MemberNumberList: new PropertyDataEntry("MemberNumberList",
		{ min: 0 },
		{
			..._PropertyDataArraysDefaults,
			validate(prop, itemData, defaults) { return this.validateSetLikeArray({ type: "number", value: prop }); },
		},
	),
	MemberNumberListKeys: new PropertyDataEntry("MemberNumberListKeys",  undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	Mode: new PropertyDataEntry("Mode",
		{ get valueSet() { return this._valueSet ??= new Set(Object.values(VibratorMode)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	NextShockTime: new PropertyDataEntry("NextShockTime",
		{ min: 0.0, isInteger: false },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	NextShrinkTime: new PropertyDataEntry("NextShrinkTime",
		{ min: 0.0, isInteger: false },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	Opacity: new PropertyDataEntry("Opacity",
		{ min: 0.0, max: 1.0, isInteger: false },
		{
			validate(prop, { asset }, defaults) {
				if (typeof prop === "number") {
					return this.validateNumber(prop, defaults);
				} else {
					// TODO: Validate as an ordered array and enforce layer-specific extremas
					return this.validateSetLikeArray(
						{ type: "number", value: prop },
						CommonIsArray(defaults) ? defaults : asset.Layer.map(l => l.Priority),
					);
				}
			},
		},
	),
	OpenPermission: new PropertyDataEntry("OpenPermission", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	OpenPermissionArm: new PropertyDataEntry("OpenPermissionArm", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	OpenPermissionChastity: new PropertyDataEntry("OpenPermissionChastity", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	OpenPermissionLeg: new PropertyDataEntry("OpenPermissionLeg", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	OrgasmCount: new PropertyDataEntry("OrgasmCount",
		{ min: 0 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	OriginalSetting: new PropertyDataEntry("OriginalSetting",
		{ valueSet: new Set(/** @type {const} */([0, 1, 2, 3])) },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	OverrideHeight: new PropertyDataEntry("OverrideHeight", undefined, {
		union(properties) {
			// Return the height override with the maximum priority
			const propSorted = [...properties].sort((a, b) => a?.Priority - b?.Priority);
			return { ...propSorted[0] };
		},
		isSubset(subProp, superProp) {
			return subProp.Priority <= superProp.Priority;
		},
		validate(prop, itemData, defaults) {
			if (!CommonIsObject(prop)) {
				if (defaults !== undefined) {
					return { status: "error", value: defaults, errorDescription: [`Invalid '${this.name}' type '${typeof prop}'`] };
				} else {
					return { status: "criticalError", errorDescription: [`Invalid '${this.name}' type '${typeof prop}'`] };
				}
			}

			/** @type {{ [k in keyof AssetOverrideHeight]-?: ItemProperty.ValidationOutput<AssetOverrideHeight[k]> }} */
			const propertyOutput = {
				Height: this.validateNumber(
					prop.Height, defaults?.Height, { name: `${this.name}['Height']` },
				),
				Priority: this.validateNumber(
					prop.Priority, defaults?.Priority, { name: `${this.name}['Priority']` },
				),
				HeightRatioProportion: prop.HeightRatioProportion === undefined ? { status: "ok", value: undefined } : this.validateNumber(
					prop.HeightRatioProportion,
					defaults?.HeightRatioProportion,
					{ name: `${this.name}['HeightRatioProportion']`, isInteger: false, min: 0.0, max: 1.0 },
				),
			};
			return ItemPropertiesMergeValidationOutputs(propertyOutput);
		},
	}),
	OverridePriority: new PropertyDataEntry("OverridePriority",
		{ min: -99, max: 99 },
		{
			compare(prop1, prop2, { asset }) {
				if (typeof prop1 === "number" && typeof prop2 === "number") {
					return prop1 === prop2;
				}
				if (typeof prop1 === "number") {
					const prop1Num = prop1;
					prop1 = CommonFromEntries(asset.Layer.map(l => [l.Name ?? "", prop1Num]));
				}
				if (typeof prop2 === "number") {
					const prop2Num = prop2;
					prop2 = CommonFromEntries(asset.Layer.map(l => [l.Name ?? "", prop2Num]));
				}
				return PropertyDataEntry.compareShallowObjects(prop1, prop2);
			},
			union(properties, { asset }) {
				if (properties.every(i => typeof i === "number")) {
					return properties[0];
				}
				const propOjbects = properties.map(i => {
					if (typeof i === "number") {
						return CommonFromEntries(asset.Layer.map(l => [l.Name ?? "", i]));
					} else if (CommonIsObject(i)) {
						return i;
					} else {
						return undefined;
					}
				}).filter(i => i !== undefined);
				return PropertyDataEntry.unionShallowObjects(propOjbects);
			},
			difference(properties, { asset }) {
				const [head, ...tail] = properties;
				/** @type {AssetLayerOverridePriority} */
				let ret = head;
				for (const priority of tail) {
					if (CommonIsObject(priority)) {
						if (CommonIsObject(ret)) {
							// obj/obj difference
							for (const [k, v] of CommonEntries(ret)) {
								if (priority[k] === v) {
									delete ret[k];
								}
							}
						} else {
							// scalar/obj difference
							/** @type {Partial<Record<LayerName, number>>} */
							ret = CommonFromEntries(asset.Layer.map(layer => {
								const defaultValue = /** @type {number} */(ret);
								const k = layer.Name ?? "";
								return [k, priority[k] === defaultValue ? undefined : defaultValue];
							}));
						}
					} else {
						if (CommonIsObject(ret)) {
							// obj/scalar difference
							for (const [k, v] of CommonEntries(ret)) {
								if (v === priority) {
									delete ret[k];
								}
							}
						} else {
							// scalar/scalar difference
							if (ret === priority) {
								return undefined;
							}
						}
					}
				}
				return ret;
			},
			compress(prop, { asset }, defaults) {
				/** @type {Partial<Record<LayerName, number>>} */
				const defaultsObj = CommonIsObject(defaults) ? defaults : CommonFromEntries(asset.Layer.map(l => [l.Name ?? "", defaults ?? l.Priority]));
				if (typeof prop === "number") {
					return Object.values(defaultsObj).every(i => i === prop) ? undefined : { [this.name]: prop };
				} else {
					const value = this.compressNumberRecord(prop, asset, defaultsObj);
					return value ? { [this.name]: value } : undefined;
				}
			},
			decompress(prop, { asset }) {
				if (typeof prop === "string") {
					const value = this.decompressNumberRecord(prop, asset);
					return value ? { [this.name]: value } : undefined;
				} else {
					return { [this.name]: prop };
				}
			},
			validate(prop, { asset }, defaults) {
				if (CommonIsObject(prop)) {
					const defaultsScalar = typeof defaults === "number" ? defaults : undefined;
					const defaultsObj = CommonIsObject(defaults) ? defaults : {};
					const defaultsNonPartial = CommonFromEntries(asset.Layer.map(layer => {
						const name = layer.Name ?? "";
						return [name, defaultsScalar ?? defaultsObj[name] ?? layer.Priority];
					}));

					/** @type {Partial<Record<LayerName, ItemProperty.ValidationOutput<number>>>} */
					const propertyOutput = CommonFromEntries(CommonEntries(prop).map(([k, v]) => {
						const metaData = { ...this.metaData, name: `${this.name}["${k}"]` };
						if (v === undefined) {
							return [k, undefined];
						} if (!(k in defaultsNonPartial)) {
							return [k, { status: "criticalError", errorDescription: [`Invalid '${this.name}' key value '${k}'`] }];
						} else {
							return [k, this.validateNumber(v, defaultsNonPartial[k], metaData)];
						}
					}));
					return ItemPropertiesMergeValidationOutputs(propertyOutput);
				} else {
					return this.validateNumber(prop, defaults);
				}
			},
		},
	),
	Padding: new PropertyDataEntry("Padding", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	Password: new PropertyDataEntry("Password",
		{ get valuePattern() { return ValidationPasswordRegex; } },
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	PortalLinkCode: new PropertyDataEntry("PortalLinkCode",
		{ get valuePattern() { return PortalLinkCodeRegex; } },
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	PublicModeCurrent: new PropertyDataEntry("PublicModeCurrent",
		{ get valueSet() { return this._valueSet ??= new Set(CommonRange(0, FuturisticTrainingBeltModes.length)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	PublicModePermission: new PropertyDataEntry("PublicModePermission",
		{ get valueSet() { return this._valueSet ??= new Set(CommonRange(0, FuturisticTrainingBeltPermissions.length)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	PunishActivity: new PropertyDataEntry("PunishActivity", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	PunishOrgasm: new PropertyDataEntry("PunishOrgasm", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	PunishProhibitedSpeech: new PropertyDataEntry("PunishProhibitedSpeech",
		{ get valueSet() { return this._valueSet ??= new Set(CommonRange(0, FuturisticTrainingBeltSpeechPunishments.length)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	PunishProhibitedSpeechWords: new PropertyDataEntry("PunishProhibitedSpeechWords", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	PunishRequiredSpeech: new PropertyDataEntry("PunishRequiredSpeech",
		{ get valueSet() { return this._valueSet ??= new Set(CommonRange(0, FuturisticTrainingBeltSpeechPunishments.length)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	PunishRequiredSpeechWord: new PropertyDataEntry("PunishRequiredSpeechWord", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	PunishSpeech: new PropertyDataEntry("PunishSpeech",
		{ get valueSet() { return this._valueSet ??= new Set(CommonRange(0, FuturisticTrainingBeltSpeechPunishments.length)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	PunishStandup: new PropertyDataEntry("PunishStandup", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	PunishStruggle: new PropertyDataEntry("PunishStruggle", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	PunishStruggleOther: new PropertyDataEntry("PunishStruggleOther", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	RemoveItem: new PropertyDataEntry("RemoveItem", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	RemoveOnUnlock: new PropertyDataEntry("RemoveOnUnlock", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	RemoveTimer: new PropertyDataEntry("RemoveTimer",
		{ min: 0.0, isInteger: false },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	Revert: new PropertyDataEntry("Revert", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	Rotation: new PropertyDataEntry("Rotation",
		{ defaultNumber: 0, min: -180, max: 180 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	RuinedOrgasmCount: new PropertyDataEntry("RuinedOrgasmCount",
		{ min: 0 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	ScaleX: new PropertyDataEntry("ScaleX",
		{ defaultNumber: 1.00, min: 0.01, max: 3.00, isInteger: false },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	ScaleY: new PropertyDataEntry("ScaleY",
		{ defaultNumber: 1.00, min: 0.01, max: 3.00, isInteger: false },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	SelfUnlock: new PropertyDataEntry("SelfUnlock", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	SetPose: new PropertyDataEntry("SetPose",
		{ get valueSet() { return this._valueSet ??= new Set(CommonKeys(PoseRecord)); } },
		{
			..._PropertyDataArraysDefaults,
		},
	),
	ShockLevel: new PropertyDataEntry("ShockLevel",
		{ valueSet: new Set(/** @type {const} */([0, 1, 2])) },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	ShowShrinkText: new PropertyDataEntry("ShowShrinkText", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	ShowText: new PropertyDataEntry("ShowText", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	ShowTimer: new PropertyDataEntry("ShowTimer", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateBoolean(prop, defaults); },
		},
	),
	ShrinkCooldown: new PropertyDataEntry("ShrinkCooldown",
		{ isInteger: false, min: 0.0 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	State: new PropertyDataEntry("State",
		{ get valueSet() { return this._valueSet ??= new Set(Object.values(VibratorModeState)); } },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	SuctionLevel: new PropertyDataEntry("SuctionLevel",
		{ valueSet: new Set(/** @type {const} */([0, 1, 2, 3, 4])) },
		{
			validate(prop, itemData, defaults) { return this.validateAsSetMember(prop, defaults); },
		},
	),
	TargetAngle: new PropertyDataEntry("TargetAngle",
		{ min: 0, max: 360 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	Text: new PropertyDataEntry("Text", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	Text2: new PropertyDataEntry("Text2", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	Text3: new PropertyDataEntry("Text3", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	// One of the rare few ordered, fixed length arrays as opposed to a set-like one
	Texts: new PropertyDataEntry("Texts",
		{
			get valuePattern() { return this._valuePattern ??= DynamicDrawTextRegex; },
			get minLength() { return this._minLength ??= ItemDevicesLuckyWheelMinTexts; },
			get maxLength() { return this._maxLength ??= ItemDevicesLuckyWheelMaxTexts; },
		},
		{
			compare(prop1, prop2) { return CommonArraysEqual(prop1, prop2, false); },
			validate(prop, itemData, defaults) {
				// TODO: Check length
				return this.validateSetLikeArray(
					{ type: "string", value: prop },
					defaults,
				);
			},
		},
	),
	TimeSinceLastOrgasm: new PropertyDataEntry("TimeSinceLastOrgasm",
		{ min: 0.0, isInteger: false },
		{
			compress(prop) { return { [this.name]: prop }; }, // Never compress
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	TimeWorn: new PropertyDataEntry("TimeWorn",
		{ min: 0.0, isInteger: false },
		{
			compress(prop) { return { [this.name]: prop }; }, // Never compress
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	Tint: new PropertyDataEntry("Tint", undefined, {
		compare(prop1, prop2) {
			for (const obj1 of prop1) {
				if (!prop2.some(obj2 => CommonObjectEqual(obj1, obj2))) {
					return false;
				}
			}
			for (const obj2 of prop2) {
				if (!prop1.some(obj1 => CommonObjectEqual(obj1, obj2))) {
					return false;
				}
			}
			return true;
		},
		union(properties) {
			const [head, ...tail] = properties;
			const ret = CommonIsArray(head) ? CommonCloneDeep(head) : [];
			for (const tintList of tail) {
				if (!CommonIsArray(tintList)) {
					continue;
				}
				for (const tint1 of tintList) {
					if (!ret.some(tint2 => CommonObjectEqual(tint1, tint2))) {
						ret.push(tint1);
					}
				}
			}
			return ret;
		},
		difference(properties) {
			const [head, ...tail] = properties;
			const ret = new Map(CommonCloneDeep(head).entries());
			const removals = new Set();
			for (const [i, tint] of ret.entries()) {
				innerLoop: for (const tintList of tail) {
					if (tintList.some(j => CommonObjectEqual(tint, j))) {
						removals.delete(i);
						break innerLoop;
					}
				}
			}
			return ret.size === 0 ? undefined : Array.from(ret.values());
		},
		isSubset(subProp, superProp) {
			for (const obj1 of subProp) {
				if (!superProp.some(obj2 => CommonObjectEqual(obj1, obj2))) {
					return false;
				}
			}
			return true;
		},
		validate(prop, { asset }, defaults) {
			if (!CommonIsArray(prop)) {
				return { status: "criticalError", errorDescription: [`Invalid '${this.name}' non-array type '${typeof prop}'`] };
			}

			const colorSchema = new Set(asset.Group.ColorSchema);
			/** @type {ItemProperty.ValidationOutput<TintDefinition>[]} */
			const validationOutput = prop.map((value, i) => {
				if (!CommonIsObject(value)) {
					return { status: "criticalError", errorDescription: [`Invalid '${this.name}[${i}]' type '${typeof value}'`] };
				}
				/** @type {{ [k in keyof TintDefinition]: ItemProperty.ValidationOutput<TintDefinition[k]> }} */
				const validationTintOutput = {
					Color: (
						typeof value.Color === "number"
						? this.validateNumber(value.Color, undefined, { name: `${this.name}[${i}]['Color']`, min: 0, max: asset.Layer.length - 1 })
						: this.validateString(value.Color, undefined, { name: `${this.name}[${i}]['Color']`, colorSchema, isColor: true })
					),
					Strength: this.validateNumber(value.Strength, undefined, { name: `${this.name}[${i}]['Strength']`, min: 0.0, max: 1.0, isInteger: false }),
					DefaultColor: (
						value.DefaultColor === undefined
						? undefined
						: this.validateString(value.DefaultColor, undefined, { name: `${this.name}[${i}]['DefaultColor']`, colorSchema, isColor: true })
					),
				};
				if (validationTintOutput.DefaultColor?.status === "criticalError") {
					// Optional value; demote criticalError to error
					validationTintOutput.DefaultColor = { ...validationTintOutput.DefaultColor, status: "error", value: undefined };
				}
				return ItemPropertiesMergeValidationOutputs(validationTintOutput);
			});
			const ret = ItemPropertiesMergeValidationOutputs(validationOutput);

			// Always allow 0-length arrays
			if (!asset.AllowTint && ret.status !== "criticalError" && ret.value.length !== 0) {
				return { status: "criticalError", errorDescription: [`Illegal property '${this.name}'`] };
			} else {
				return ret;
			}
		},
	}),
	TranslationX: new PropertyDataEntry("TranslationX",
		{ defaultNumber: 0, min: -500, max: 500 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	TranslationY: new PropertyDataEntry("TranslationY",
		{ defaultNumber: 0, min: -500, max: 500 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	TriggerCount: new PropertyDataEntry("TriggerCount",
		{ min: 0 },
		{
			validate(prop, itemData, defaults) { return this.validateNumber(prop, defaults); },
		},
	),
	TriggerValues: new PropertyDataEntry("TriggerValues", undefined,
		{
			validate(prop, itemData, defaults) { return this.validateString(prop, defaults); },
		},
	),
	TypeRecord: new PropertyDataEntry("TypeRecord", undefined, {
		compare: PropertyDataEntry.compareShallowObjects,
		union: PropertyDataEntry.unionShallowObjects,
		difference: PropertyDataEntry.differenceShallowObjects,
		compress(prop) {
			const entries = CommonEntries(prop ?? {}).filter(([k, v]) => !!v);
			return entries.length ? { [this.name]: CommonFromEntries(entries) } : undefined;
		},
		validate(prop, itemData) {
			const { C, asset } = itemData;

			/** @type {string[]} */
			const errorDescription = [];
			if (!CommonIsObject(prop)) {
				errorDescription.push(`Invalid '${this.name}' type '${typeof prop}'`);
				prop = {};
			}

			/** @type {string[]} */
			const blockedKeys = [];
			const subTypeRecordList = CommonFilterMap(
				ExtendedItemGatherOptions(AppearanceItem.fromAsset(itemData.asset, { property: { TypeRecord: { ...prop } } })),
				(option) => {
					const subTypeRecord = { ...(/** @type {ItemProperties} */(option.Property)?.TypeRecord ?? {}) };
					for (const [key, value] of Object.entries(subTypeRecord)) {
						if (value === undefined) {
							continue;
						} else if (C && value !== 0 && InventoryIsPermissionBlocked(C, asset.Name, asset.Group.Name, `${key}${value}`)) {
							// Non-default option explicitly blocked by the user
							subTypeRecord[key] = 0;
							blockedKeys.push(`'${key}${value}'`);
							return undefined;
						} else if (option.OptionType === "VibratingItemOption" && VibratorModesAdvanced.includes(option.Property?.Mode) && C?.ArousalSettings.DisableAdvancedVibes) {
							// Option blocked due to being an advanced vibrator mode
							subTypeRecord[key] = 0;
							blockedKeys.push(`'${key}${value}'`);
							return undefined;
						}
					}
					return subTypeRecord;
				},
			);
			const newTypeRecord = this.union(subTypeRecordList, itemData);
			if (blockedKeys.length) {
				errorDescription.push(`Invalid user-blocked '${this.name}' keys: ${blockedKeys.sort().join(", ")}`);
			}

			const extraKeys = CommonFilterMap(Object.entries(prop), ([k, v]) => v !== undefined && newTypeRecord?.[k] === undefined ? `'${k}'` : undefined).sort();
			const missingKeys = CommonFilterMap(Object.entries(newTypeRecord ?? {}), ([k, v]) => v !== undefined && prop?.[k] === undefined ? `'${k}'` : undefined).sort();
			if (extraKeys.length) {
				errorDescription.push(`invalid extra '${this.name}' keys: ${extraKeys.join(", ")}`);
			}
			if (missingKeys.length) {
				errorDescription.push(`invalid missing '${this.name}' keys: ${missingKeys.join(", ")}`);
			}
			if (errorDescription.length) {
				return { status: "error", value: prop, errorDescription };
			} else {
				return { status: "ok", value: prop };
			}
		},
	}),
	UnHide: new PropertyDataEntry("UnHide",
		{ get valueSet() { return this._valueSet ??= new Set(AssetGroup.map(a => a.Name)); } },
		{
			..._PropertyDataArraysDefaults,
		},
	),
};
