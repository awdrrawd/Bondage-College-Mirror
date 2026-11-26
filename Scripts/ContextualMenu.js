"use strict";

/**
 * Create a synthetic mouse event for touch triggers.
 * @param {number} clientX
 * @param {number} clientY
 * @returns {PointerEvent}
 */
function ContextualMenuCreateSyntheticMouseEvent(clientX, clientY) {
	return new PointerEvent("contextmenu", {
		bubbles: true,
		cancelable: true,
		clientX,
		clientY,
		button: 2,
	});
}

/**
 * Contextual menu system with plugin support.
 * Plugins may only add items or submenus; separators are system-managed.
 */
class ContextualMenuManagerImpl {
	/** @type {HTMLElement | null} */
	#menu = null;
	/** @type {HTMLElement | null} */
	#backdrop = null;

	/** @type {Map<string, ContextualMenu.PluginEntry>} */
	#plugins = new Map();
	#suppressNextContextMenu = false;
	/** @type {number | null} */
	#touchTimerId = null;
	/** @type {boolean} */
	#touchTriggered = false;
	/** @type {{ x: number, y: number } | null} */
	#touchOrigin = null;
	/** @type {number} */
	#longPressMs = 400;
	/** @type {number} */
	#tapMaxMove = 15;
	/** Backdrop saw a pointerdown, so the following click is a dismiss, not the gesture that opened the menu. */
	#armedDismiss = false;
	/** @type {() => void} */
	#onResize = () => this.#fitWithinViewport();
	/**
	 * Cursor position the root menu was opened from.
	 * @type {{ x: number, y: number } | null}
	 */
	#anchor = null;
	/** Gap kept between a menu edge and the viewport, in pixels. */
	#viewportMargin = 8;
	#openedAt = 0;
	/** @type {{ [K in keyof ContextualMenu.ContextMap]?: (contextData: ContextualMenu.ContextMap[K]) => ContextualMenu.Item[] }} */
	#vanillaMenus = {
		...ContextualVanillaMenus,
	};

	/**
	 * @template {ContextualMenu.ContextKey} K
	 * @param {K} contextType
	 * @param {ContextualMenu.ContextMap[K]} contextData
	 * @param {ContextualMenu.ShowOptions} [options]
	 * @returns {boolean}
	 */
	show(contextType, contextData, options) {
		const event = options?.event;
		if (!event || event.shiftKey) return false;
		const items = this.#buildMenuItems(contextType, contextData);
		if (items.length === 0) return false;

		this.#close();
		this.#renderMenu(items, event.clientX, event.clientY);
		if (event.type === "contextmenu" && event.isTrusted) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			this.#suppressNextContextMenu = true;
		}
		return true;
	}

	/**
	 * Register a plugin to manage contextual menu items.
	 * @param {string} pluginId
	 * @param {string} displayName
	 * @returns {ContextualMenu.PluginAPI | null}
	 */
	registerPlugin(pluginId, displayName) {
		if (!pluginId) {
			console.error("ContextualMenu.registerPlugin: missing pluginId");
			return null;
		}
		if (this.#plugins.has(pluginId)) {
			console.error(`ContextualMenu.registerPlugin: plugin '${pluginId}' already registered`);
			return null;
		}
		const entry = /** @type {ContextualMenu.PluginEntry} */ ({
			displayName: displayName || pluginId,
			itemsByContext: new Map(),
			menuBuilders: new Map(),
		});
		this.#plugins.set(pluginId, entry);
		/** @type {ContextualMenu.PluginAPI} */
		const api = {
			registerItems: (contextType, items) => {
				if (typeof items !== "function") {
					console.error("ContextualMenu.registerItems: items must be a function");
					return;
				}
				entry.itemsByContext.set(contextType, items);
			},
			unregisterItems: (contextType) => {
				entry.itemsByContext.delete(contextType);
			},
			registerMenu: (contextType, items) => {
				if (typeof items !== "function") {
					console.error("ContextualMenu.registerMenu: items must be a function");
					return;
				}
				entry.menuBuilders.set(contextType, items);
			},
			unregisterMenu: (contextType) => {
				entry.menuBuilders.delete(contextType);
			},
			unload: () => {
				this.#plugins.delete(pluginId);
			},
		};
		return Object.freeze(api);
	}

	/**
	 * @returns {boolean} - `true` when the custom menu is on screen
	 */
	isOpen() {
		return this.#menu != null;
	}

	/**
	 * Open from a canvas right-click, and keep the browser menu from replacing a custom one.
	 * Shift-click leaves the browser menu alone. A long-press opens before the browser event; that event is swallowed.
	 * @param {MouseEvent} event
	 * @returns {void}
	 */
	handleContextMenu(event) {
		if (this.#suppressNextContextMenu) {
			this.#suppressNextContextMenu = false;
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		if (event.target instanceof Node && this.#menu?.contains(event.target)) return;

		if (event.currentTarget === MainCanvas?.canvas) {
			GamePointerMove(/** @type {PointerEvent} */ (event), false);
			CommonRightClick(/** @type {PointerEvent} */ (event));
		} else if (event.target === this.#backdrop) {
			event.preventDefault();
			event.stopPropagation();
			this.#close();
			return;
		}

		if (this.#menu) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 * Handle touch start for long-press support.
	 * @param {TouchEvent} event
	 */
	handleTouchStart(event) {
		if (!CommonIsMobile) return;
		if (!event.changedTouches?.length) return;
		const touch = event.changedTouches[0];
		this.#touchTriggered = false;
		const startX = touch.clientX;
		const startY = touch.clientY;
		this.#touchOrigin = { x: startX, y: startY };
		if (this.#touchTimerId != null) {
			clearTimeout(this.#touchTimerId);
		}
		this.#touchTimerId = setTimeout(() => {
			this.#touchTriggered = true;
			const synthetic = ContextualMenuCreateSyntheticMouseEvent(startX, startY);
			GamePointerMove(synthetic, false);
			CommonRightClick(synthetic);
		}, this.#longPressMs);
	}

	/**
	 * Handle touch move to cancel long-press if moved too far.
	 * @param {TouchEvent} event
	 */
	handleTouchMove(event) {
		if (!CommonIsMobile || !this.#touchOrigin) return;
		if (!event.changedTouches?.length) return;
		const touch = event.changedTouches[0];
		const dx = touch.clientX - this.#touchOrigin.x;
		const dy = touch.clientY - this.#touchOrigin.y;
		if (Math.hypot(dx, dy) > this.#tapMaxMove && this.#touchTimerId != null) {
			clearTimeout(this.#touchTimerId);
			this.#touchTimerId = null;
		}
	}

	/**
	 * Handle touch end; returns true if click should be suppressed.
	 * @param {TouchEvent} event
	 * @returns {boolean}
	 */
	handleTouchEnd(event) {
		if (!CommonIsMobile) return false;
		if (!event.changedTouches?.length) return false;
		if (this.#touchTimerId != null) {
			clearTimeout(this.#touchTimerId);
			this.#touchTimerId = null;
		}
		this.#touchOrigin = null;
		return this.#touchTriggered;
	}

	/**
	 * Close the contextual menu if open.
	 * @returns {void}
	 */
	#close() {
		const menu = this.#menu;
		const backdrop = this.#backdrop;
		this.#menu = null;
		this.#backdrop = null;
		this.#anchor = null;
		this.#armedDismiss = false;
		menu?.remove();
		backdrop?.remove();
		window.removeEventListener("resize", this.#onResize);
	}

	/**
	 * Render a menu item.
	 * @param {HTMLElement} menu
	 * @param {ContextualMenu.Button} item
	 */
	#renderButton(menu, item) {
		const disabled = CommonUnwrapThunk(item.disabled) === true;
		ElementButton.Create(
			null,
			() => {
				if (Date.now() - this.#openedAt < 500) return;
				item.callback?.();
				this.#close();
			},
			{
				role: "menuitem", noStyling: true, disabled,
				label: [CommonUnwrapThunk(item.label)],
				labelPosition: "left",
				image: CommonUnwrapThunk(item.icon),
			 },
			{
				button: {
					classList: ["contextual-menu-item"],
					parent: menu,
				},
			},
		);
	}

	/**
	 * Shift a box into the viewport. Width and height are not changed.
	 * When the box is larger than the viewport, its top-left stays at the margin.
	 * @param {number} width
	 * @param {number} height
	 * @param {number} left
	 * @param {number} top
	 * @returns {{ left: number, top: number }}
	 */
	#offsetBoxIntoViewport(width, height, left, top) {
		const margin = this.#viewportMargin;
		const maxLeft = window.innerWidth - margin - width;
		const maxTop = window.innerHeight - margin - height;
		return {
			left: Math.round(Math.max(margin, Math.min(left, maxLeft))),
			top: Math.round(Math.max(margin, Math.min(top, maxTop))),
		};
	}

	/**
	 * How much of a horizontal span lies inside the viewport margin.
	 * @param {number} left
	 * @param {number} width
	 * @returns {number}
	 */
	#visibleWidth(left, width) {
		const margin = this.#viewportMargin;
		const visibleLeft = Math.max(left, margin);
		const visibleRight = Math.min(left + width, window.innerWidth - margin);
		return Math.max(0, visibleRight - visibleLeft);
	}

	/**
	 * Place the root menu at the cursor, shifted so it stays inside the window.
	 */
	#fitWithinViewport() {
		const menu = this.#menu;
		const anchor = this.#anchor;
		if (!menu || !anchor) return;
		const canvasRect = MainCanvas.canvas.getBoundingClientRect();
		ElementSetFontSize(menu, 24);
		const rect = menu.getBoundingClientRect();
		const placed = this.#offsetBoxIntoViewport(
			rect.width,
			rect.height,
			canvasRect.left + anchor.x * canvasRect.width,
			canvasRect.top + anchor.y * canvasRect.height,
		);
		menu.style.setProperty("left", `${placed.left}px`);
		menu.style.setProperty("top", `${placed.top}px`);
		for (const child of menu.querySelectorAll(":scope > .contextual-menu-submenu-button > .contextual-menu-submenu-open")) {
			if (child instanceof HTMLElement) this.#fitSubmenu(child);
		}
	}

	/**
	 * Place an open submenu beside its parent item, inside the window.
	 * Vertically centered on the trigger. Prefers the right side, then the left. Size is left unchanged.
	 * @param {HTMLElement} submenu
	 */
	#fitSubmenu(submenu) {
		const wrapper = submenu.parentElement;
		if (!(wrapper instanceof HTMLElement)) return;

		wrapper.classList.remove("contextual-menu-submenu-open-left");
		submenu.style.removeProperty("left");
		submenu.style.removeProperty("top");
		submenu.style.removeProperty("right");
		submenu.style.removeProperty("margin-left");
		submenu.style.removeProperty("margin-right");

		const parentRect = wrapper.getBoundingClientRect();
		const natural = submenu.getBoundingClientRect();
		const width = natural.width;
		const height = natural.height;
		if (width <= 0 || height <= 0) return;

		const gap = Math.max(0, natural.left - parentRect.right);
		const rightX = parentRect.right + gap;
		const leftX = parentRect.left - gap - width;
		const openLeft = this.#visibleWidth(rightX, width) < width
			&& this.#visibleWidth(leftX, width) > this.#visibleWidth(rightX, width);
		const anchorX = openLeft ? leftX : rightX;
		const anchorY = parentRect.top + (parentRect.height - height) / 2;
		const placed = this.#offsetBoxIntoViewport(width, height, anchorX, anchorY);

		wrapper.classList.toggle(
			"contextual-menu-submenu-open-left",
			placed.left + width <= parentRect.left + gap + 0.5,
		);
		submenu.style.setProperty("margin-left", "0px");
		submenu.style.setProperty("margin-right", "0px");
		submenu.style.setProperty("right", "auto");
		submenu.style.setProperty("left", `${Math.round(placed.left - parentRect.left)}px`);
		submenu.style.setProperty("top", `${Math.round(placed.top - parentRect.top)}px`);

		for (const child of submenu.querySelectorAll(":scope > .contextual-menu-submenu-button > .contextual-menu-submenu-open")) {
			if (child instanceof HTMLElement) this.#fitSubmenu(child);
		}
	}

	/**
	 * Render one menu item of any type.
	 * @param {HTMLElement} menu
	 * @param {ContextualMenu.Item} item
	 */
	#renderItem(menu, item) {
		if (CommonUnwrapThunk(item.hidden) === true) return;
		if (item.type === "separator") {
			ElementCreate({ tag: "hr", classList: ["contextual-menu-separator"], parent: menu });
		} else if (item.type === "section") {
			ElementCreate({
				tag: "div",
				classList: ["contextual-menu-section"],
				children: [CommonUnwrapThunk(item.label)],
				parent: menu,
			});
		} else if (item.type === "submenu") {
			this.#renderSubmenu(menu, item);
		} else if (item.type === "button") {
			this.#renderButton(menu, item);
		}
	}

	/**
	 * Render a submenu.
	 * @param {HTMLElement} menu
	 * @param {ContextualMenu.Submenu} item
	 */
	#renderSubmenu(menu, item) {
		const disabled = CommonUnwrapThunk(item.disabled) === true;

		const focus = () => {
			if (disabled) return;
			submenu.classList.add("contextual-menu-submenu-open");
			this.#fitSubmenu(submenu);
		};
		const unfocus = () => {
			queueMicrotask(() => {
				if (button.contains(document.activeElement)) return;
				submenu.classList.remove("contextual-menu-submenu-open");
				button.classList.remove("contextual-menu-submenu-open-left");
			});
		};
		const button = ElementButton.Create(
			null,
			null,
			{
				role: "menuitem",
				noStyling: true,
				disabled,
				ariaHasPopup: "menu",
				label: [CommonUnwrapThunk(item.label)],
				labelPosition: "left",
				image: CommonUnwrapThunk(item.icon),
			},
			{
				button: {
					classList: ["contextual-menu-item", "contextual-menu-submenu-button"],
					eventListeners: {
						click: (ev) => {
							if (disabled || (ev.target instanceof Node && submenu.contains(ev.target))) return;
							const open = ev.detail === 0 || !submenu.classList.contains("contextual-menu-submenu-open");
							submenu.classList.toggle("contextual-menu-submenu-open", open);
							if (open) this.#fitSubmenu(submenu);
							else button.classList.remove("contextual-menu-submenu-open-left");
						},
						focus: focus,
						focusout: unfocus,
						mouseenter: focus,
						mouseleave: unfocus,
					},
					parent: menu,
				},
			},
		);
		const submenu = ElementMenu.Create(
			null,
			[],
			{ role: "menu" },
			{
				menu: {
					classList: ["contextual-menu", "contextual-menu-submenu"],
					attributes: { "aria-orientation": "vertical" },
					parent: button,
				},
			},
		);
		for (const child of item.children) {
			this.#renderItem(submenu, child);
		}
	}

	/**
	 * Render the contextual menu.
	 * @param {ContextualMenu.Item[]} items
	 * @param {number} clientX
	 * @param {number} clientY
	 */
	#renderMenu(items, clientX, clientY) {
		this.#backdrop = ElementCreate({
			tag: "div",
			classList: ["contextual-menu-backdrop"],
			parent: document.body,
			eventListeners: {
				pointerdown: (ev) => {
					ev.stopPropagation();
					if (Date.now() - this.#openedAt < 500) return;
					this.#armedDismiss = true;
				},
				pointerup: (ev) => ev.stopPropagation(),
				click: (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					if (Date.now() - this.#openedAt < 500) return;
					if (this.#armedDismiss) this.#close();
				},
				contextmenu: (ev) => this.handleContextMenu(ev),
			},
		});
		const menu = ElementMenu.Create(
			null,
			[],
			{ role: "menu" },
			{
				menu: {
					classList: ["contextual-menu"],
					attributes: { "aria-orientation": "vertical", "screen-generated": null, "tabindex": "-1" },
					eventListeners: {
						focusout: (ev) => {
							if (this.#menu !== menu) return;
							const next = ev.relatedTarget;
							if (next instanceof Node && menu.contains(next)) return;
							this.#close();
						},
						keydown: (ev) => {
							if (this.#menu !== menu) return;
							ev.stopPropagation();
							if (ev.key === "Escape") this.#close();
						},
						keyup: (ev) => {
							if (this.#menu !== menu) return;
							ev.stopPropagation();
						},
					},
					parent: document.body,
				},
			},
		);

		for (const item of items) {
			this.#renderItem(menu, item);
		}

		const theme = Player?.ChatSettings?.ColorTheme;
		if (theme) menu.dataset.colortheme = theme.toLowerCase();

		this.#menu = menu;
		const canvasRect = MainCanvas.canvas.getBoundingClientRect();
		this.#anchor = {
			x: (clientX - canvasRect.left) / (canvasRect.width || 1),
			y: (clientY - canvasRect.top) / (canvasRect.height || 1),
		};
		this.#openedAt = Date.now();
		this.#fitWithinViewport();
		window.addEventListener("resize", this.#onResize);
		menu.focus({ preventScroll: true, focusVisible: false });
	}

	/**
	 * Build menu items for a context, including plugin items and separators.
	 * @template {ContextualMenu.ContextKey} K
	 * @param {K} contextType
	 * @param {ContextualMenu.ContextMap[K]} contextData
	 * @returns {ContextualMenu.Item[]}
	 */
	#buildMenuItems(contextType, contextData) {
		const items = this.#getVanillaItems(contextType, contextData);

		const pluginBlocks = this.#getPluginBlocks(contextType, contextData);
		if (pluginBlocks.length > 0) {
			if (items.length > 0) items.push(/** @type {ContextualMenu.Separator} */({ type: "separator" }));
			pluginBlocks.forEach((block, idx) => {
				items.push(...block);
				if (idx < pluginBlocks.length - 1) {
					items.push(/** @type {ContextualMenu.Separator} */({ type: "separator" }));
				}
			});
		}
		return items;
	}

	/**
	 * Get vanilla items for a context.
	 * @template {ContextualMenu.ContextKey} K
	 * @param {K} contextType
	 * @param {ContextualMenu.ContextMap[K]} contextData
	 * @returns {ContextualMenu.Item[]}
	 */
	#getVanillaItems(contextType, contextData) {
		const builder = /** @type {undefined | ((data: ContextualMenu.ContextMap[K]) => ContextualMenu.Item[])} */ (
			this.#vanillaMenus[contextType]
		);
		if (!builder) return [];
		return this.#normalizeItems(builder(contextData), true);
	}

	/**
	 * Get plugin items by plugin, sorted alphabetically by pluginId.
	 * @template {ContextualMenu.ContextKey} K
	 * @param {K} contextType
	 * @param {ContextualMenu.ContextMap[K]} contextData
	 * @returns {ContextualMenu.Item[][]}
	 */
	#getPluginBlocks(contextType, contextData) {
		const blocks = [];
		const entries = Array.from(this.#plugins.entries())
			.sort((a, b) => a[0].localeCompare(b[0]));
		for (const [_pluginId, plugin] of entries) {
			const block = [];
			const menuBuilder = plugin.menuBuilders.get(contextType);
			if (typeof menuBuilder === "function") {
				block.push(...this.#normalizeItems(menuBuilder(contextData)));
			}
			const items = plugin.itemsByContext.get(contextType);
			if (typeof items === "function") {
				block.push(...this.#normalizeItems(items(contextData)));
			}
			if (block.length > 0) blocks.push(block);
		}
		return blocks;
	}

	/**
	 * Normalize and validate menu items (plugin items must be item/submenu).
	 * @param {unknown[]} items - The items to normalize
	 * @param {boolean} [allowSystemTypes] - Whether to allow system-managed types (separators/sections)
	 * @returns {ContextualMenu.Item[]}
	 */
	#normalizeItems(items, allowSystemTypes = false) {
		if (!CommonIsArray(items)) return [];
		const normalized = [];
		for (const rawItem of items) {
			if (!CommonIsObject(rawItem)) continue;
			const item = /** @type {ContextualMenu.Item} */ (rawItem);
			if (CommonUnwrapThunk(item.hidden) === true) continue;
			if (item.type === "button") {
				normalized.push(item);
			} else if (item.type === "submenu") {
				const children = this.#normalizeItems(item.children, true);
				if (children.length === 0) continue;
				normalized.push({ ...item, children });
			} else if (allowSystemTypes && (item.type === "separator" || item.type === "section")) {
				normalized.push(item);
			} else {
				// Ignore invalid plugin entries (system manages separators/sections)
				continue;
			}
		}
		return normalized;
	}

}

var ContextualMenu = new ContextualMenuManagerImpl();
