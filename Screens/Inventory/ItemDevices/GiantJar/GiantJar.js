"use strict";

/** @type {ExtendedItemScriptHookCallbacks.AfterDraw<TextItemData>} */
function AssetsItemDevicesGiantJarAfterDrawHook(data, originalFunction, { C, A, CA, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color }) {
	if (L !== "Text Stroke") return;
	let fillColor = Color;
	let strokeColor = Color;
	if (Array.isArray(CA.Color)) {
		if (CommonIsColor(CA.Color[18])) {
			fillColor = CA.Color[18];
		}
		if (CommonIsColor(CA.Color[19])) {
			strokeColor = CA.Color[19];
		}
	}
	if ((Property?.TypeRecord?.d ?? 0) === 1) {
		const canvas = AnimationGenerateTempCanvas(C, A, 408, 236);
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		DynamicDrawTextFromTo(Property?.Text ?? "", ctx, [5, 120], [400, 120], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 4, fontSize: 100, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		DynamicDrawTextFromTo(Property?.Text2 ?? "", ctx, [12, 40], [393, 40], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 2, fontSize: 60, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		DynamicDrawTextFromTo(Property?.Text3 ?? "", ctx, [12, 194], [389, 194], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 2, fontSize: 60, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		drawCanvas(canvas, X + 46, Y + 382, AlphaMasks);
		drawCanvasBlink(canvas, X + 46, Y + 382, AlphaMasks);
		return;
	}
	if ((Property?.TypeRecord?.d ?? 0) === 2) {
		const canvas = AnimationGenerateTempCanvas(C, A, 408, 238);
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		DynamicDrawTextFromTo(Property?.Text ?? "", ctx, [10, 12], [387, 208], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 3, fontSize: 60, textAlign: "center", textBaseline: "middle", width: 400, contain: true });
		DynamicDrawTextFromTo(Property?.Text2 ?? "", ctx, [111, 149], [277, 77], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 3, fontSize: 50, textAlign: "center", textBaseline: "middle", width: 380, contain: true });
		DynamicDrawTextFromTo(Property?.Text3 ?? "", ctx, [44, 91], [367, 134], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 3, fontSize: 50, textAlign: "center", textBaseline: "middle", width: 400, contain: true });
		drawCanvas(canvas, X + 46, Y + 382, AlphaMasks);
		drawCanvasBlink(canvas, X + 46, Y + 382, AlphaMasks);
		return;
	}
	if ((Property?.TypeRecord?.d ?? 0) === 3) {
		const canvas = AnimationGenerateTempCanvas(C, A, 440, 860);
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		DynamicDrawTextFromTo(Property?.Text ?? "", ctx, [69, 33], [371, 33], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 2, fontSize: 45, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		DynamicDrawTextFromTo(Property?.Text2 ?? "", ctx, [5, 795], [435, 795], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 4, fontSize: 60, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		DynamicDrawTextFromTo(Property?.Text3 ?? "", ctx, [5, 840], [435, 840], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 2, fontSize: 35, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		drawCanvas(canvas, X + 29, Y + 72, AlphaMasks);
		drawCanvasBlink(canvas, X + 29, Y + 72, AlphaMasks);
		return;
	}
	if ((Property?.TypeRecord?.d ?? 0) === 4) {
		const canvas = AnimationGenerateTempCanvas(C, A, 440, 860);
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		DynamicDrawTextFromTo(Property?.Text ?? "", ctx, [75, 34], [363, 18], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 2, fontSize: 30, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		DynamicDrawTextFromTo(Property?.Text2 ?? "", ctx, [17, 793], [425, 807], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 3, fontSize: 60, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		DynamicDrawTextFromTo(Property?.Text3 ?? "", ctx, [24, 832], [255, 819], { fontFamily: "Archivo Black", color: fillColor, strokeColor, strokeWidth: 2, fontSize: 60, textAlign: "center", textBaseline: "middle", width: 0, contain: true });
		drawCanvas(canvas, X + 29, Y + 72, AlphaMasks);
		drawCanvasBlink(canvas, X + 29, Y + 72, AlphaMasks);
		return;
	}
}
