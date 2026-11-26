"use strict";

/**
 * Determine how much (if any!) space the scrollbar occupies and alter the reserved scrollbar gutter size accordingly.
 */
function CSSSetScrollbarVariables() {
	const scrollableElem = ElementCreate({
		tag: "div",
		parent: document.body,
		style: { width: "100px", height: "100px", "visiblity": "hidden", "overflow": "scroll" },
		children: [
			{ tag: "div", style: { width: "100px", height: "200px" } },
		],
	});

	const thinScrollableElem = ElementCreate({
		tag: "div",
		parent: document.body,
		style: { width: "100px", height: "100px", "visiblity": "hidden", "overflow": "scroll", "scrollbar-width": "thin" },
		children: [
			{ tag: "div", style: { width: "100px", height: "200px" } },
		],
	});

	const scrollbarWidth = scrollableElem.offsetWidth - scrollableElem.clientWidth;
	const scrollbarWidthThin = thinScrollableElem.offsetWidth - thinScrollableElem.clientWidth;
	const [vh, vw] = CSS.supports("height: 10dvh") ? ["dvh", "dvw"] : ["vh", "vw"];
	let browserStyle = "";
	if (scrollbarWidth === 0) {
		browserStyle = "Firefox";
		document.body.style.setProperty("--scrollbar-width", "0px");
		document.body.style.setProperty("--scrollbar-width-thin", "0px");
		document.body.style.setProperty("--scrollbar-gutter", `max(15px, min(2.5${vh}, 1.25${vw}))`);
	} else {
		browserStyle = "Chromium";
		document.body.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
		document.body.style.setProperty("--scrollbar-width-thin", `${scrollbarWidthThin}px`);
		document.body.style.setProperty("--scrollbar-gutter", `max(0px, calc(min(2.5${vh}, 1.25${vw}) - var(--scrollbar-width)))`);
	}

	console.debug(
		`Initializing ${browserStyle}-style scrollbar padding:`,
		`{ --scrollbar-width: ${scrollbarWidth}px, --scrollbar-width-thin: ${scrollbarWidthThin}px }`,
	);
	scrollableElem.remove();
	thinScrollableElem.remove();
}

/** @satisfies {Record<string, { url: string, condition: string }>} */
const CSSSupportCases = {
	"Dynamic viewport units": {
		url: "https://caniuse.com/viewport-unit-variants",
		condition: "height: 10dvh",
	},
	"Color mixing": {
		url: "https://caniuse.com/wf-color-mix",
		condition: "background-color: color-mix(in srgb, red, green)",
	},
	"CSS Masks": {
		url: "https://caniuse.com/css-masks",
		condition: "mask: url('./Icons/PrivateInvert.png') center/contain",
	},
};

/**
 *
 * @param {Record<string, { url: string, condition: string }>} cases
 */
function CSSCheckSupport(cases) {
	/** @type {{ name: string, url: string }[]} */
	const failures = CommonFilterMap(
		CommonEntries(cases),
		(([name, { url, condition }]) => !CSS.supports(condition) ? { name, url } : undefined),
	);

	if (failures.length) {
		console.error(
			`Browser lacks support for the following CSS features:`,
			`${JSON.stringify(Object.fromEntries(failures.map(({ name, url }) => [name, url])), undefined, 4)}`
		);
		ToastManager.warning(
			[
				"Your browser lacks support for expected CSS features and may experience UI oddities or even breakage:",
				ElementCreate({
					tag: "ul",
					style: { "list-style-type": '"❌"', "margin-block": "unset", "padding-left": "2.3em" },
					children: failures.map(({ name }) => { return { tag: "li", children: [name], style: { "padding-left": "0.15em" } }; }),
				}),
			],
			{
				clampMessage: false,
				duration: 30_000,
				title: "Outdated browser warning",
				onClick: (ev, toast) => CommonClipboardWrite(
					toast.innerText,
					(result) => { if (result.ok()) { ToastManager.info("Message coppied to clipboard"); }},
				),
			},
		);
	} else {
		console.debug("Browser has support for all expected CSS features");
	}
}

CSSSetScrollbarVariables();
