"use strict";

/** @type {ExtendedItemCallbacks.BeforeDraw} */
function AssetsItemVulvaPiercingsCockRingLeashBeforeDraw(data) {
	if (data.L === "Handle" || data.L === "Leash") {
		return { LayerType: data.C.HasEffect("IsLeashed") ? "Held" : ""};
	}
	return data;
}
