"use strict";

/**
 * ModularItem.js
 * --------------
 * This file contains utilities related to modular extended items (for example the High Security Straitjacket). It is
 * generally not necessary to call functions in this file directly - these are called from Asset.js when an item is
 * first registered.
 *
 * A modular item is a typed item, but each type may be comprised of several independent "modules". For example, the
 * High Security Straitjacket has 3 different modules: crotch panel (c), arms (a), and crotch straps (s), and each
 * module can be configured independently. The resulting type then uses an abbreviated format which represents the
 * module values comprising that type. Each module contains a number of options that may be chosen for that module.
 *
 * For example "c0a1s2" - represents the type where the crotch panel module uses option 0, the arms module uses option
 * 1, and the crotch straps module uses option 2. The properties of the type will be derived from a combination of the
 * properties of each of the type's module options. For example, difficulty will be calculated by summing up the
 * difficulties for each of its module options.
 *
 * All dialogue for modular items should be added to `Dialog_Player.csv`. To implement a modular item, you need the
 * following dialogue entries:
 * - "<GroupName><AssetName>SelectBase" - This is the text that will be displayed on the module selection screen (e.g.
 *   `ItemArmsHighSecurityStraitJacketSelectBase` - "Configure Straitjacket")
 * - For each module:
 *   - "<GroupName><AssetName>Select<ModuleName>" - This is the text that will be displayed on the module's subscreen
 *     (e.g. `ItemArmsHighSecurityStraitJacketSelectCrotch` - "Configure crotch panel")
 *   - "<GroupName><AssetName>Module<ModuleName>" - This is the text that will be used to describe the module (under
 *     the module's button) in the module selection screen (e.g. `ItemArmsHighSecurityStraitJacketModuleCrotch` -
 *     "Crotch Panel")
 * - For each option:
 *   - "<GroupName><AssetName>Option<ModuleKey><OptionNumber>" - This is the text that will be used to describe the
 *     option (under the option's button) in the module subscreen for the module containing that option (e.g.
 *     `ItemArmsHighSecurityStraitJacketOptionc0` - "No crotch panel")
 * - If the item's chat setting is configured to `PER_MODULE`, you will need a chatroom message for each module,
 *   which will be sent when that module changes. It should have the format "<GroupName><AssetName>Set<ModuleName>"
 *   (e.g. `ItemArmsHighSecurityStraitJacketSetCrotch` - "SourceCharacter changed the crotch panel on
 *   DestinationCharacter straitjacket")
 * - If the item's chat setting is configured to `PER_OPTION`, you will need a chatroom message for each option, which
 *   will be sent when that option is selected. It should have the format
 *   "<GroupName><AssetName>Set<ModuleKey><OptionNumber>" (e.g. `ItemArmsHighSecurityStraitJacketSetc0` -
 *   "SourceCharacter removes the crotch panel from DestinationCharacter straitjacket")
 */

/**
 * The keyword used for the base menu on modular items
 * @constant {string}
 */
const ModularItemBase = "Base";

/**
 * A lookup for the modular item configurations for each registered modular item
 * @constant
 * @type {Record<string, ModularItemData>}
 * @see {@link ModularItemData}
 */
const ModularItemDataLookup = {};

/**
 * An enum encapsulating the possible chatroom message settings for modular items
 * @satisfies {Record<"PER_MODULE"|"PER_OPTION", ModularItemChatSetting>}
 */
const ModularItemChatSetting = /** @type {const} */ ({
	/**
	 * The item has one chatroom message per option.
	 * For finer granularity - each individual option within a module can have its own chatroom message.
	 * @default
	 */
	PER_OPTION: "default",
	/**
	 * The item has one chatroom message per module.
	 * Messages for individual options within a module are all the same.
	 */
	PER_MODULE: "perModule",
});

/**
 * Registers a modular extended item. This automatically creates the item's load, draw and click functions.
 * @param {Asset} asset - The asset being registered
 * @param {ModularItemConfig} config - The item's modular item configuration
 * @returns {ModularItemData} - The generated extended item data for the asset
 */
function ModularItemRegister(asset, config) {
	const data = ModularItemCreateModularData(asset, config);

	/** @type {ExtendedItemCallbackStruct<ModularItemOption>} */
	const defaultCallbacks = {
		load: () => ModularItemLoad(data),
		click: () => ModularItemClick(data),
		draw: () => ModularItemDraw(data),
		validate: (...args) => ExtendedItemValidate(data, ...args),
		publishAction: (...args) => ModularItemPublishAction(data, ...args),
		init: (...args) => ModularItemInit(data, ...args),
		setOption: (...args) => ExtendedItemSetOption(data, ...args),
	};
	ExtendedItemCreateCallbacks(data, defaultCallbacks);
	ModularItemGenerateValidationProperties(data);
	return data;
}

/**
 * Initialize the modular item properties
 * @param {ModularItemData} Data - The item's extended item data
 * @param {Character} C - The character that has the item equiped
 * @param {Item} Item - The item in question
 * @param {boolean} Push - Whether to push to changes to the server
 * @param {boolean} Refresh - Whether to refresh the character. This should generally be `true`, with custom script hooks being a potential exception.
 * @param {boolean} log - Whether to log `Init()`-initialized property updates to the console
 * @returns {boolean} Whether properties were initialized or not
 */
function ModularItemInit(Data, C, Item, Push=true, Refresh=true, log=false) {
	// Check if all the expected properties are present; extra properties are ignored
	const expectedProps = ModularItemMergeModuleValues(Data, ModularItemParseCurrent(Data, Item.Property.TypeRecord));
	const customPropertiesBackup = CommonPick(expectedProps, ExtendedItemInitPropertyIgnore);
	CommonKeys(customPropertiesBackup).forEach(k => delete expectedProps[k]);
	CommonKeys(Data.baselineProperty ?? {}).forEach(k => delete expectedProps[k]);

	const isSubset = ItemPropertiesIsSubset(expectedProps, Item.Property, Item.Asset, { gatherNonEquivalancies: log });
	let update = !isSubset.result;

	const customProperties = CommonPick(Item.Property, ExtendedItemInitPropertyIgnore);
	Item.Property = ItemPropertiesUnion([customProperties, expectedProps, Item.Property, customPropertiesBackup, Data.baselineProperty ?? {}], Item.Asset);

	// Initialize subscreen(s) in a DFS manner
	const typeRecord = Item.Property.TypeRecord ?? {};
	for (const mod of Data.modules) {
		const option = mod.Options[typeRecord[mod.Key]];
		update = ExtendedItemInitSubscreen(option, Item, C, false, false) || update;
	}

	if (update) {
		if (Refresh) {
			CharacterRefresh(C, Push, false);
		}
		if (Push) {
			ChatRoomCharacterItemUpdate(C, Data.asset.Group.Name);
		}
	}

	if (update && log) {
		console.error(
			`Updating incomplete/missing ${C.Name} (${C.MemberNumber ?? C.Type}) "${Item.Asset.Group.Name}/${Item.Asset.Name}" item properties`,
			{ changes: Array.from(isSubset.nonEquivalencies).sort() },
		);
	}

	return update;
}

/**
 * @param {ModularItemData} data
 */
function ModularItemLoad(data) {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;
	if (!C || !item) return;

	const header = typeof data.dialogPrefix.header === "function" ?
		data.dialogPrefix.header(data, C, item)
		: data.dialogPrefix.header;
	DialogExtendedMessage = AssetTextGet(`${header}${data.currentModule}`);
}

/**
 * @param {ModularItemData} data
 */
function ModularItemClick(data) {
	const currentModule = data.currentModule || ModularItemBase;
	return data.clickFunctions[currentModule]();
}

/**
 * @param {ModularItemData} data
 */
function ModularItemDraw(data) {
	const currentModule = data.currentModule || ModularItemBase;
	return data.drawFunctions[currentModule]();
}

/**
 * Parse the and pre-process the passed modules (and their options)
 * @param {Asset} asset - The asset in question
 * @param {readonly ModularItemModuleConfig[]} modules - An object describing a single module for a modular item.
 * @param {boolean | undefined} [changeWhenLocked] - See {@link ModularItemConfig.ChangeWhenLocked}
 * @returns {ModularItemModule[]} - The updated modules and options
 */
function ModularItemBuildModules(asset, modules, changeWhenLocked) {
	return modules.map(protoMod => {
		const drawImages = typeof protoMod.DrawImages === "boolean" ? protoMod.DrawImages : true;

		/** @type {ModularItemModule} */
		return {
			...protoMod,
			drawData: /** @type {never} */ (null), // Initialized later on in ModularItemCreateModularData
			OptionType: "ModularItemModule",
			DrawImages: drawImages,
			Options: protoMod.Options.map((_protoOption, i) => {
				const protoOption = ExtendedItemParseOptions(_protoOption, asset);

				/** @type {ModularItemOption} */
				const option = {
					...CommonOmit(protoOption, ["ArchetypeConfig"]),
					Name: `${protoMod.Key}${i}`,
					OptionType: "ModularItemOption",
					ModuleName: protoMod.Name,
					Index: i,
					ParentData: /** @type {never} */ (null), // Initialized later on in `ModularItemCreateModularData`
					ArchetypeData: null, // Also initialized later on in `ModularItemCreateModularData`
					Property: {
						...ExtendedItemParseProperties(asset, protoOption.Property ?? {}),
						TypeRecord: { [protoMod.Key]: i },
					}
				};

				if (typeof changeWhenLocked === "boolean" && typeof option.ChangeWhenLocked !== "boolean") {
					option.ChangeWhenLocked = changeWhenLocked;
				}
				return option;
			}),
		};
	});
}

/**
 * Generates an asset's modular item data
 * @param {Asset} asset - The asset to generate modular item data for
 * @param {ModularItemConfig} config - The item's extended item configuration
 * @param {null | ExtendedItemOption} parentOption - The parent extended item option of the super screens (if any)
 * @returns {ModularItemData} - The generated modular item data for the asset
 */
function ModularItemCreateModularData(asset, {
	Modules,
	ChatSetting,
	ChatTags,
	ChangeWhenLocked,
	DialogPrefix,
	ScriptHooks,
	Dictionary,
	DrawData,
	BaselineProperty,
	AllowEffect,
	DrawImages,
	Name,
}, parentOption=null) {
	// Set the name of all modular item options
	// Use an external function as typescript does not like the inplace updating of an object's type
	const moduleConfigs = Modules ?? [];
	const ModulesParsed = ModularItemBuildModules(asset, moduleConfigs, ChangeWhenLocked);
	// Only enable DrawImages in the base screen if all module-specific DrawImages are true
	const BaseDrawImages = (typeof DrawImages !== "boolean") ? ModulesParsed.every((m) => m.DrawImages) : DrawImages;

	/** @type {`${AssetGroupName}${string}`} */
	const key = `${asset.Group.Name}${asset.Name}`;
	const name = Name != null ? Name : (parentOption == null ? ExtendedArchetype.MODULAR : parentOption.Name);
	DialogPrefix = DialogPrefix || {};
	/** @type {ModularItemData} */
	const data = ModularItemDataLookup[key] = {
		archetype: ExtendedArchetype.MODULAR,
		asset,
		chatSetting: ChatSetting || ModularItemChatSetting.PER_OPTION,
		key,
		name,
		typeCount: 1,
		functionPrefix: `Inventory${key}`,
		dynamicAssetsFunctionPrefix: `Assets${key}`,
		dialogPrefix: {
			header: DialogPrefix.Header || `${key}Select`,
			module: DialogPrefix.Module || `${key}Module`,
			option: DialogPrefix.Option || `${key}Option`,
			chat: DialogPrefix.Chat || `${key}Set`,
		},
		chatTags: Array.isArray(ChatTags) ? ChatTags : [
			CommonChatTags.SOURCE_CHAR,
			CommonChatTags.DEST_CHAR,
		],
		modules: ModulesParsed,
		currentModule: ModularItemBase,
		pages: { [ModularItemBase]: 0 },
		drawData: TypedItemGetDrawData(asset, DrawData, ModulesParsed, { drawImage: BaseDrawImages, imagePath: null }),
		scriptHooks: ExtendedItemParseScriptHooks(ScriptHooks || {}),
		drawFunctions: {},
		clickFunctions: {},
		baselineProperty: typeof BaselineProperty === "object" ? BaselineProperty : null,
		dictionary: Array.isArray(Dictionary) ? Dictionary : [],
		parentOption: null,
		allowEffect: Array.isArray(AllowEffect) ? AllowEffect : [],
	};

	// Populate the modules drawdata
	let i = -1;
	for (const mod of ModulesParsed) {
		i += 1;
		/** @type {Partial<ElementData<ElementMetaData.Modular>>} */
		const buttonDataOverride = CommonOmit(data.drawData.elementData[i], ["position", "imagePath", "drawImage"]);
		if (typeof moduleConfigs[i].DrawImages === "boolean") {
			buttonDataOverride.drawImage = moduleConfigs[i].DrawImages;
		} else if (typeof DrawImages === "boolean") {
			buttonDataOverride.drawImage = DrawImages;
		} else {
			buttonDataOverride.drawImage = true;
		}
		mod.drawData = TypedItemGetDrawData(asset, moduleConfigs[i].DrawData, mod.Options, buttonDataOverride);
		for (const [j, option] of mod.Options.entries()) {
			option.ParentData = data;
			const protoOption = moduleConfigs[i].Options[j];
			if (protoOption.ArchetypeConfig) {
				option.ArchetypeData = AssetBuildExtended(asset, protoOption.ArchetypeConfig, AssetFemale3DCGExtended, option);
			}
		}
	}

	data.drawFunctions[ModularItemBase] = ModularItemCreateDrawBaseFunction(data);
	data.clickFunctions[ModularItemBase] = ModularItemCreateClickBaseFunction(data);
	for (const module of ModulesParsed) {
		data.pages[module.Name] = 0;
		data.drawFunctions[module.Name] = () => ModularItemDrawModule(module, data);
		data.clickFunctions[module.Name] = () => ModularItemClickModule(module, data);
		data.typeCount *= module.Options.length;
	}
	return data;
}

/**
 * Creates a modular item's base draw function (for the module selection screen)
 * @param {ModularItemData} data - The modular item data for the asset
 * @returns {() => void} - The modular item's base draw function
 */
function ModularItemCreateDrawBaseFunction(data) {
	return () => {
		/** @type {ModularItemButtonDefinition[]} */
		const buttonDefinitions = data.modules
			.map((module, i) => {
				const currentValues = ModularItemParseCurrent(data, DialogFocusItem?.Property.TypeRecord);
				const currentOption = module.Options[currentValues[i]];
				return [module, currentOption, data.dialogPrefix.module];
			});
		return ModularItemDrawCommon(ModularItemBase, buttonDefinitions, data, data.drawData);
	};
}

/**
 * Maps a modular item option to a button definition for rendering the option's button.
 * @param {ModularItemOption} option - The option to draw a button for
 * @param {ModularItemModule} module - A reference to the option's parent module
 * @param {ModularItemData} data - The modular item's data
 * @param {number} currentOptionIndex - The currently selected option index for the module
 * @returns {ModularItemButtonDefinition} - A button definition array representing the provided option
 */
function ModularItemMapOptionToButtonDefinition(option, module, { dialogPrefix }, currentOptionIndex) {
	const currentOption = module.Options[currentOptionIndex];
	return [option, currentOption, dialogPrefix.option];
}

/**
 * Draws a module screen from the provided button definitions and modular item data.
 * @param {string} moduleName - The name of the module whose page is being drawn
 * @param {readonly ModularItemButtonDefinition[]} buttonDefinitions - A list of button definitions to draw
 * @param {ModularItemData} data - The modular item's data
 * @param {ExtendedItemDrawData<ElementMetaData.Modular>} drawData
 * @returns {void} - Nothing
 */
function ModularItemDrawCommon(
	moduleName,
	buttonDefinitions,
	data,
	{ paginate, pageCount, elementData, itemsPerPage },
) {
	const item = data.asset.IsLock ? DialogFocusSourceItem : DialogFocusItem;
	if (!item) return;
	if (ExtendedItemSubscreen) {
		CommonCallFunctionByNameWarn(`${ExtendedItemFunctionPrefix(item)}${ExtendedItemSubscreen}Draw`);
		return;
	}

	ExtendedItemDrawHeader(item);
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "808080");

	// Permission mode toggle
	DrawButton(
		1775, 25, 90, 90, "", "White",
		ExtendedItemPermissionMode ? "Icons/DialogNormalMode.png" : "Icons/DialogPermissionMode.png",
		InterfaceTextGet(ExtendedItemPermissionMode ? "DialogMenuNormalMode" : "DialogMenuPermissionMode"),
	);

	const pageNumber = Math.min(pageCount - 1, data.pages[moduleName] || 0);
	const pageStart = pageNumber * itemsPerPage;
	const page = buttonDefinitions.slice(pageStart, pageStart + itemsPerPage);

	for (const [i, [option, currentOption, prefix]] of page.entries()) {
		ExtendedItemDrawButton(option, currentOption, prefix, elementData[i + pageStart], item);
	}

	if (paginate) {
		DrawButton(1665, 240, 90, 90, "", "White", "Icons/Prev.png");
		DrawButton(1775, 240, 90, 90, "", "White", "Icons/Next.png");
	}

	// If the assets allows tightening / loosening
	ExtendedItemTighten.Draw(data, item, [1050, 220, 300, 65]);
}

/**
 * Draws the extended item screen for a given module.
 * @param {ModularItemModule} module - The module whose screen to draw
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemDrawModule(module, data) {
	const moduleIndex = data.modules.indexOf(module);
	const currentValues = ModularItemParseCurrent(data, DialogFocusItem?.Property.TypeRecord);
	const buttonDefinitions = module.Options.map(
		(option) => ModularItemMapOptionToButtonDefinition(option, module, data, currentValues[moduleIndex]));
	ModularItemDrawCommon(module.Name, buttonDefinitions, data, module.drawData);
}

/**
 * Generates a click function for a modular item's module selection screen
 * @param {ModularItemData} data - The modular item's data
 * @returns {function(): void} - A click handler for the modular item's module selection screen
 */
function ModularItemCreateClickBaseFunction(data) {
	const DrawData = data.drawData;
	return () => {
		const pageNumber = Math.min(DrawData.pageCount - 1, data.pages[ModularItemBase] ?? 0);
		ModularItemClickCommon(
			data,
			DrawData,
			() => {
				DialogLeaveFocusItem();
			},
			i => {
				const C = CharacterGetCurrent();
				if (!C) return false;
				const pageStart = pageNumber * DrawData.itemsPerPage;
				const page = data.modules.slice(pageStart, pageStart + DrawData.itemsPerPage);
				const module = page[i % DrawData.itemsPerPage];
				if (module) {
					if (C.IsPlayer() && module.AllowSelfSelect === false) {
						DialogExtendedMessage = InterfaceTextGet("CannotSelfSelect");
					}
					ModularItemModuleTransition(module.Name, data);
					return true;
				}
				return false;
			},
			(delta) => ModularItemChangePage(ModularItemBase, delta, data, DrawData),
			pageNumber,
		);
	};
}

/**
 * A generic click handler for a module's screen
 * @param {ModularItemModule} module - The module whose screen we are currently in
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemClickModule(module, data) {
	const DrawData = module.drawData;
	const pageNumber = Math.min(DrawData.pageCount - 1, data.pages[module.Name] ?? 0);
	ModularItemClickCommon(
		data,
		DrawData,
		() => ModularItemModuleTransition(ModularItemBase, data),
		i => {
			const C = CharacterGetCurrent();
			const item = DialogFocusItem;
			if (!C || !item) return false;
			const typeRecord = item?.Property.TypeRecord ?? {};
			const pageStart = pageNumber * DrawData.itemsPerPage;
			const page = module.Options.slice(pageStart, pageStart + DrawData.itemsPerPage);
			const selected = page[i % DrawData.itemsPerPage];
			if (selected) {
				if (ExtendedItemPermissionMode) {
					const IsFirst = i === 0;
					const Worn = C.IsPlayer() && typeRecord[module.Key] === i;
					InventoryTogglePermission(item, selected.Name, IsFirst || Worn);
				} else {
					ModularItemSetType(module, i, data);
				}
				return true;
			}
			return false;
		},
		(delta) => ModularItemChangePage(module.Name, delta, data, DrawData),
		pageNumber,
	);
}

/**
 * A common click handler for modular item screens. Note that pagination is not currently handled, but will be added
 * in the future.
 * @param {ModularItemData} data
 * @param {ExtendedItemDrawData<ElementMetaData.Modular>} drawData
 * @param {function(): void} exitCallback - A callback to be called when the exit button has been clicked
 * @param {function(number): boolean} itemCallback - A callback to be called when an item has been clicked
 * @param {function(number): void} paginateCallback - A callback to be called when a pagination button has been clicked
 * @param {number} pageNumber - The currently shown page
 * @returns {void} - Nothing
 */
function ModularItemClickCommon(data, { paginate, elementData, itemsPerPage }, exitCallback, itemCallback, paginateCallback, pageNumber) {
	const item = data.asset.IsLock ? DialogFocusSourceItem : DialogFocusItem;
	if (!item) return;
	if (ExtendedItemSubscreen) {
		CommonCallFunctionByNameWarn(`${ExtendedItemFunctionPrefix(item)}${ExtendedItemSubscreen}Click`);
		return;
	}

	// Exit button
	if (MouseIn(1885, 25, 90, 90)) {
		exitCallback();
		ExtendedItemPermissionMode = false;
		return;
	} else if (MouseIn(1775, 25, 90, 90)) {
		// Permission toggle button
		if (ExtendedItemPermissionMode) {
			ChatRoomCharacterUpdate(Player);
			ExtendedItemRequirementCheckMessageMemo.clearCache();
		}
		ExtendedItemPermissionMode = !ExtendedItemPermissionMode;
		return;
	} else if (paginate) {
		if (MouseIn(1665, 240, 90, 90)) return paginateCallback(-1);
		else if (MouseIn(1775, 240, 90, 90)) return paginateCallback(1);
	}

	let i = pageNumber * itemsPerPage;
	const elementDataSlice = elementData.slice(pageNumber * itemsPerPage, (1 + pageNumber) * itemsPerPage);
	for (const { position, hidden } of elementDataSlice) {
		if (!hidden && MouseIn(...position) && itemCallback(i)) {
			break;
		}
		i++;
	}

	// If the assets allows tightening / loosening
	if (ExtendedItemTighten.Click(data, item, [1050, 220, 300, 65])) {
		return;
	}
}

/**
 * Handles page changing for modules
 * @param {string} moduleName - The name of the module whose page should be modified
 * @param {number} delta - The page delta to apply to the module's current page
 * @param {ModularItemData} data - The modular item's data
 * @param {ExtendedItemDrawData<ElementMetaData.Modular>} drawData
 * @returns {void} - Nothing
 */
function ModularItemChangePage(moduleName, delta, data, { pageCount }) {
	const currentPage = data.pages[moduleName];
	data.pages[moduleName] = (currentPage + pageCount + delta) % pageCount;
}

/**
 * Transitions between pages within a modular item's extended item menu
 * @param {string} newModule - The name of the new module to transition to
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemModuleTransition(newModule, data) {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;
	if (!C || !item) return;
	data.currentModule = newModule;
	const header = typeof data.dialogPrefix.header === "function" ?
		data.dialogPrefix.header(data, C, item)
		: data.dialogPrefix.header;
	DialogExtendedMessage = AssetTextGet(header + newModule);
}

/**
 * Parses the focus item's current type into an array representing the currently selected module options
 * @param {ModularItemData} data - The modular item's data
 * @param {null | undefined | TypeRecord} typeRecord - The type string for a modular item. If null, use a type string extracted from the selected module options
 * @returns {number[]} - An array of numbers representing the currently selected options for each of the item's modules
 */
function ModularItemParseCurrent({ asset, modules }, typeRecord) {
	if (!CommonIsObject(typeRecord)) {
		return Array(modules.length).fill(0);
	}
	return modules.map(module => {
		const index = typeRecord[module.Key];
		if (module.Options[index] === undefined) {
			// FIXME
			// console.error(`${asset.Group.Name}:${asset.Name}: invalid key for module "${module.Key}": ${index}`);
			return 0;
		} else {
			return index;
		}
	});
}

/**
 * Merges all of the selected module options for a modular item into a single Property object to set on the item
 * @param {ModularItemData} data - The modular item's data
 * @param {readonly number[]} moduleValues - The numeric values representing the current options for each module
 * @param {ItemProperties|null} BaselineProperty - Initial properties
 * @returns {ItemProperties} - A property object created from combining each module of the modular item
 */
function ModularItemMergeModuleValues({ asset, modules }, moduleValues, BaselineProperty=null) {
	/** @type {ItemProperties} */
	const BaseLineProperties = {
		Block: Array.isArray(asset.Block) ? asset.Block.slice() : [],
		Effect: Array.isArray(asset.Effect) ? asset.Effect.slice() : [],
		Hide: Array.isArray(asset.Hide) ? asset.Hide.slice() : [],
		HideItem: Array.isArray(asset.HideItem) ? asset.HideItem.slice() : [],
		AllowActivity: Array.isArray(asset.AllowActivity) ? asset.AllowActivity.slice() : [],
		Attribute: Array.isArray(asset.Attribute) ? asset.Attribute.slice() : [],
		Tint: asset.AllowTint ? [...asset.Tint] : undefined,
		CustomBlindBackground: asset.CustomBlindBackground,
	};
	const properties = modules.map((module, i) => module.Options[moduleValues[i] || 0].Property);
	return ItemPropertiesUnion([BaselineProperty ?? {}, ...properties], asset, BaseLineProperties);
}

/**
 * Sets a modular item's type based on a change in a module's option selection.
 * @param {ModularItemModule} module - The module that changed
 * @param {number} index - The index of the newly chosen option within the module
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemSetType(module, index, data) {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;
	if (!C || !item) {
		return;
	}

	const newOption = module.Options[index];
	const currentModuleValues = ModularItemParseCurrent(data, item.Property.TypeRecord);
	const moduleIndex = data.modules.indexOf(module);
	const previousOption = module.Options[currentModuleValues[moduleIndex]];

	const requirementMessage = ExtendedItemRequirementCheckMessage(data, C, item, newOption, previousOption, true);
	if (requirementMessage) {
		DialogExtendedMessage = requirementMessage;
		return;
	}

	// Do not sync appearance while in the wardrobe
	const IsCloth = item.Asset.Group.Clothing;
	/** @type {Parameters<ExtendedItemCallbacks.SetOption<ModularItemOption>>} */
	const optionArgs = [C, item, newOption, previousOption, !IsCloth, true];
	CommonCallFunctionByNameWarn(`${data.functionPrefix}SetOption`, ...optionArgs);

	if (!IsCloth) {
		const groupName = data.asset.Group.Name;
		CharacterRefresh(C, true, false);
		ChatRoomCharacterItemUpdate(C, groupName);

		if (ServerPlayerIsInChatRoom()) {
			/** @type {Parameters<ExtendedItemCallbacks.PublishAction<ModularItemOption>>} */
			const args = [C, item, newOption, previousOption];
			CommonCallFunctionByNameWarn(`${data.functionPrefix}PublishAction`, ...args);
		} else if (!C.IsPlayer()) {
			C.CurrentDialog = DialogFind(C, `${data.key}${module.Key}${index}`, groupName);
		}
	}

	// If the module's option has a subscreen, transition to that screen instead of the main page of the item.
	if (newOption.HasSubscreen) {
		ExtendedItemSubscreen = newOption.Name;
		CommonCallFunctionByName(`${data.functionPrefix}${ExtendedItemSubscreen}Load`);
	} else {
		ModularItemModuleTransition(ModularItemBase, data);
	}
}

/**
 * Publishes the chatroom message for a modular item when one of its modules has changed.
 * @param {ModularItemData} data
 * @param {Character} C
 * @param {Item} item
 * @param {ModularItemOption} newOption
 * @param {ModularItemOption} previousOption
 * @returns {void} - Nothing
 */
function ModularItemPublishAction(data, C, item, newOption, previousOption) {
	if (newOption.Name === previousOption.Name) {
		return;
	}

	const chatData = {
		C,
		newOption,
		previousOption,
		newIndex: newOption.Index,
		previousIndex: previousOption.Index,
	};
	const dictionary = ExtendedItemBuildChatMessageDictionary(chatData, data, item);

	let msg = (typeof data.dialogPrefix.chat === "function") ? data.dialogPrefix.chat(chatData) : data.dialogPrefix.chat;
	switch (data.chatSetting) {
		case ModularItemChatSetting.PER_OPTION:
			msg += newOption.Name;
			break;
		case ModularItemChatSetting.PER_MODULE:
			msg += newOption.ModuleName;
			break;
	}
	ChatRoomPublishCustomAction(msg, false, dictionary.build());
}

/**
 * Generates and sets the AllowLock and AllowLockType properties for an asset based on its modular item data. For types
 * where two independent options declare conflicting AllowLock properties (i.e. one option declares AllowLock: false and
 * another declares AllowLock: true), the resulting type will permit locking (i.e. true overrides false).
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemGenerateAllowLockType({ asset, modules }) {
	const allowLockType = /** @type {Record<string, Set<number>>} */ ({ ...(asset.AllowLockType ?? {}) });
	let allowAll = true;
	for (const module of modules) {
		allowLockType[module.Name] = new Set();
		for (const [i, option] of CommonEnumerate(module.Options)) {
			const allowLock = typeof option.AllowLock === "boolean" ? option.AllowLock : asset.AllowLock;
			if (allowLock) {
				allowLockType[module.Name].add(i);
			} else {
				allowAll = false;
			}
		}
	}
	TypedItemSetAllowLockType(asset, allowLockType, allowAll);
}

/**
 * Generates and assigns a modular asset's AllowType, AllowEffect and AllowBlock properties, along with the AllowTypes
 * properties on the asset layers based on the values set in its module definitions.
 * @param {ModularItemData} data - The modular item's data
 * @returns {void} - Nothing
 */
function ModularItemGenerateValidationProperties(data) {
	const asset = /** @type {Mutable<Asset>} */(data.asset);
	const { modules } = data;
	asset.Extended = true;
	const allowEffect = asset.AllowEffect = CommonIsArray(asset.AllowEffect) ? [...data.allowEffect, ...asset.AllowEffect] : [...data.allowEffect];
	CommonArrayConcatDedupe(allowEffect, asset.Effect);
	const allowBlock = asset.AllowBlock = CommonIsArray(asset.Block) ? asset.Block.slice() : [];
	const allowHide = asset.AllowHide = CommonIsArray(asset.Hide) ? asset.Hide.slice() : [];
	const allowHideItem = asset.AllowHideItem = CommonIsArray(asset.HideItem) ? asset.HideItem.slice() : [];
	for (const module of modules) {
		for (const {Property} of module.Options) {
			if (Property) {
				if (Property.Effect) CommonArrayConcatDedupe(allowEffect, Property.Effect);
				if (Property.Block) CommonArrayConcatDedupe(allowBlock, Property.Block);
				if (Property.Hide) CommonArrayConcatDedupe(allowHide, Property.Hide);
				if (Property.HideItem) CommonArrayConcatDedupe(allowHideItem, Property.HideItem);
				if (Property.Tint && Array.isArray(Property.Tint) && Property.Tint.length > 0) asset.AllowTint = true;
			}
		}
	}
	ModularItemGenerateAllowLockType(data);
}

/**
 * Hide an HTML element if a given module is not active.
 * @param {ModularItemData} Data - The modular item data
 * @param {string} ID - The id of the element
 * @param {string} Module - The module that must be active
 * @returns {boolean} Whether the module is active or not
 */
function ModularItemHideElement(Data, ID, Module) {
	const Element = document.getElementById(ID);
	if (Element == null) {
		return Data.currentModule === Module;
	}

	if (Data.currentModule === Module) {
		Element.toggleAttribute("hidden", false);
		return true;
	} else {
		Element.toggleAttribute("hidden", true);
		return false;
	}
}
