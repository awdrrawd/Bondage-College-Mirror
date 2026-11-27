import { Game } from "./Utils";

import _valdiationTestParam from "./Property-validation.json";
const valdiationTestParam = _valdiationTestParam as never as Record<
	string,
	Record<string, {
		name: keyof ItemProperties,
		value: any,
		defaults?: any,
		metaData?: ItemProperty.MetaData2<any>,
		output: ItemProperty.ValidationOutput<any>,
	}>
>;

beforeAll(async () => {
	const ret = await Game.loadAll();
	return ret;
});

describe("PropertyDataEntry.validateAsLiteralSet", () => {
	const param = Object.entries(valdiationTestParam.validateAsLiteralSet).map(([key, value]) => {
		if (value.metaData?.valueSet) {
			(value.metaData as Mutable<ItemProperty.MetaData2<any>>).valueSet = new Set(value.metaData.valueSet);
		}
		return { description: key, ...value };
	});
	it.each(param)("$description", ({ name, value, defaults, metaData, output: referenceOutput }) => {
		const entry: ItemProperty.EntryNullable<any> & Record<string, any> = Game.PropertyData[name];
		expect(entry).not.toBe(undefined);

		const output: ItemProperty.ValidationOutput<unknown[]> = entry.validateAsLiteralSet(value, defaults, metaData);
		expect(output.status).toBe(referenceOutput.status);
		switch (output.status) {
			case "ok":
				expect(referenceOutput.value).toEqual(expect.arrayContaining(output.value));
				break;
			case "error":
				expect(referenceOutput.value).toEqual(expect.arrayContaining(output.value));
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
			case "criticalError":
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
		}
	});
});

describe("PropertyDataEntry.validateAsSetMember", () => {
	const param = Object.entries(valdiationTestParam.validateAsSetMember).map(([key, value]) => {
		if (value.metaData?.valueSet) {
			(value.metaData as Mutable<ItemProperty.MetaData2<any>>).valueSet = new Set(value.metaData.valueSet);
		}
		return { description: key, ...value };
	});
	it.each(param)("$description", ({ name, value, defaults, metaData, output: referenceOutput }) => {
		const entry: ItemProperty.EntryNullable<any> & Record<string, any> = Game.PropertyData[name];
		expect(entry).not.toBe(undefined);

		const output: ItemProperty.ValidationOutput<unknown> = entry.validateAsSetMember(value, defaults, metaData);
		expect(output.status).toBe(referenceOutput.status);
		switch (output.status) {
			case "ok":
				expect(referenceOutput.value).toBe(output.value);
				break;
			case "error":
				expect(referenceOutput.value).toBe(output.value);
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
			case "criticalError":
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
		}
	});
});

describe("PropertyDataEntry.validateNumber", () => {
	const param = Object.entries(valdiationTestParam.validateNumber).map(([key, value]) => {
		if (key.includes("Non-finite")) {
			value.value = NaN;
		}
		return { description: key, ...value };
	});
	it.each(param)("$description", ({ name, value, defaults, metaData, output: referenceOutput }) => {
		const entry: ItemProperty.EntryNullable<any> & Record<string, any> = Game.PropertyData[name];
		expect(entry).not.toBe(undefined);

		const output: ItemProperty.ValidationOutput<number> = entry.validateNumber(value, defaults, metaData);
		expect(output.status).toBe(referenceOutput.status);
		switch (output.status) {
			case "ok":
				expect(referenceOutput.value).toBe(output.value);
				break;
			case "error":
				expect(referenceOutput.value).toBe(output.value);
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
			case "criticalError":
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
		}
	});
});

describe("PropertyDataEntry.validateString", () => {
	const param = Object.entries(valdiationTestParam.validateString).map(([key, value]) => {
		if (key.includes("Invalid BC color")) {
			(value.metaData as Mutable<ItemProperty.MetaData2<any>>).colorSchema = new Set(["Default"] as const);
		} else if (key.includes("Invalid regex pattern")) {
			(value.metaData as Mutable<ItemProperty.MetaData2<any>>).valuePattern = /b+/;
		}
		return { description: key, ...value };
	});
	it.each(param)("$description", ({ name, value, defaults, metaData, output: referenceOutput }) => {
		const entry: ItemProperty.EntryNullable<any> & Record<string, any> = Game.PropertyData[name];
		expect(entry).not.toBe(undefined);

		const output: ItemProperty.ValidationOutput<string> = entry.validateString(value, defaults, metaData);
		expect(output.status).toBe(referenceOutput.status);
		switch (output.status) {
			case "ok":
				expect(referenceOutput.value).toBe(output.value);
				break;
			case "error":
				expect(referenceOutput.value).toBe(output.value);
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
			case "criticalError":
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
		}
	});
});

describe("PropertyDataEntry.validateBoolean", () => {
	const param = Object.entries(valdiationTestParam.validateBoolean).map(([key, value]) => {
		return { description: key, ...value };
	});
	it.each(param)("$description", ({ name, value, defaults, metaData, output: referenceOutput }) => {
		const entry: ItemProperty.EntryNullable<any> & Record<string, any> = Game.PropertyData[name];
		expect(entry).not.toBe(undefined);

		const output: ItemProperty.ValidationOutput<boolean> = entry.validateBoolean(value, defaults, metaData);
		expect(output.status).toBe(referenceOutput.status);
		switch (output.status) {
			case "ok":
				expect(referenceOutput.value).toBe(output.value);
				break;
			case "error":
				expect(referenceOutput.value).toBe(output.value);
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
			case "criticalError":
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
		}
	});
});

describe("PropertyDataEntry.isSubsetShallowObjects", () => {
	it("TypeRecord", () => {
		// Yes, we're cheating here
		const asset = {} as Asset;
		const entry: ItemProperty.EntryNullable<any> & Record<string, any> = Game.PropertyData.TypeRecord;
		expect(entry).not.toBe(undefined);

		const output1 = entry.isSubset({ a: 1 }, { a: 1, b: 2 }, { asset });
		expect(output1).toBe(true);

		const output2 = entry.isSubset({ a: 1, b: 2 }, { a: 1, b: 2 }, { asset });
		expect(output2).toBe(true);

		const output3 = entry.isSubset({ a: 1 }, { a: 2, b: 2 }, { asset });
		expect(output3).toBe(false);
	});
});

describe("PropertyDataEntry.validateSetLikeArray", () => {
	const param = Object.entries(valdiationTestParam.validateSetLikeArray).map(([key, value]) => {
		return { description: key, ...value };
	});
	it.each(param)("$description", ({ name, value, defaults, metaData, output: referenceOutput }) => {
		const entry: ItemProperty.EntryNullable<any> & Record<string, any> = Game.PropertyData[name];
		expect(entry).not.toBe(undefined);

		const output: ItemProperty.ValidationOutput<unknown[]> = entry.validateSetLikeArray(value, defaults, metaData);
		expect(output.status).toBe(referenceOutput.status);
		switch (output.status) {
			case "ok":
				expect(referenceOutput.value).toEqual(expect.arrayContaining(output.value));
				break;
			case "error":
				expect(referenceOutput.value).toEqual(expect.arrayContaining(output.value));
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
			case "criticalError":
				expect(referenceOutput.errorDescription).toEqual(expect.arrayContaining(output.errorDescription));
				break;
		}
	});
});

describe("Object validation", () => {
	it("Invalid layer rotation entry", () => {
		const entry: ItemProperty.EntryNullable<"LayerRotation"> = Game.PropertyData.LayerRotation;
		expect(entry).not.toBe(undefined);

		const asset: Asset = Game.AssetGet("Female3DCG", "ItemMouth", "BallGag");
		expect(asset).not.toBe(undefined);

		const output = entry.validate({ Ball: 99, Foo: 1 }, { asset });
		expect(output.status).toBe("error");
		expect(output.value?.Ball).toBe(99);
		expect(output.value?.Foo).toBe(undefined);
	});
});

type ExtendedItemDataUnion = (
	ModularItemData
	| TypedItemData
	| VibratingItemData
	| VariableHeightData
	| TextItemData
	| NoArchItemData
);

describe("Verify extended item option property validity", () => {
	const types = {
		"modular": "TestingModularItemDataLookup",
		"typed": "TestingTypedItemDataLookup",
		"vibrating": "TestingVibratingItemDataLookup",
		"variableheight": "TestingVariableHeightItemDataLookup",
		"text": "TestingTextItemDataLookup",
		"noarch": "TestingNoArchItemDataLookup",
	};
	const param = Object.entries(types).map(([name, symbol]) => { return { name, symbol }; });
	it.each(param)("$name", ({ name, symbol }) => {
		const dataLookup: Record<string, ExtendedItemDataUnion> = Game[symbol];
		expect(dataLookup).not.toBe(undefined);

		// Skip TypeRecords, as each option only contains a subset of all expected entries
		const failures: Record<string, unknown> = {};
		for (const data of Object.values(dataLookup)) {
			switch (data.archetype) {
				case "modular": {
					const options = data.modules.flatMap(mod => mod.Options);
					for (const option of options) {
						const output = Game.ItemPropertiesValidate(option.Property, data.asset, { omit: ["TypeRecord"] });
						if (output.status !== "ok") {
							failures[`${data.asset.Group.Name}/${data.asset.Name}/${data.archetype}/${option.Name}`] = output.errorDescriptions;
						}
					}
					break;
				}
				case "vibrating":
				case "typed": {
					for (const option of data.options) {
						const output = Game.ItemPropertiesValidate(option.Property, data.asset, { omit: ["TypeRecord"] });
						if (output.status !== "ok") {
							failures[`${data.asset.Group.Name}/${data.asset.Name}/${data.archetype}/${option.Name}`] = output.errorDescriptions;
						}
					}
					break;
				}
			}

			const baselineOutput = Game.ItemPropertiesValidate(data.baselineProperty, data.asset, { omit: ["TypeRecord"] });
			if (baselineOutput.status !== "ok") {
				failures[`${data.asset.Group.Name}/${data.asset.Name}/${data.archetype}/baseline`] = baselineOutput.errorDescriptions;
			}
		}
		expect(failures).toEqual({});
	});
});
