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
