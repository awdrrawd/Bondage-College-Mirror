import { Logger } from "@mod-utils/log";
import { debugFlag, ModInfo, resourceBaseURL } from "@mod-utils/rollupHelper";
import { fetchAssetOverrides } from "@mod-utils/fetchAssetOverrides";

const fixSeparator = resourceBaseURL.endsWith("/")
    ? (path) => (path.startsWith("/") ? path.substring(1) : path)
    : (path) => (path.startsWith("/") ? path : `/${path}`);

class PreloadItem {
    /**
     * @param {string} url
     * @param {(img:HTMLImageElement)=>void} [onload]
     */
    constructor(url, onload) {
        this.img = new Image();
        this.img.crossOrigin = "anonymous";
        this.loaded = false;
        this.onloads = [];
        this.retries = 0;
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second

        if (onload) this.onloads.push(onload);
        this.img.onload = () => {
            this.loaded = true;
            for (const fn of this.onloads) {
                fn(this.img);
            }
            this.onloads = [];
        };
        this.img.onerror = () => {
            this.retries++;
            if (this.retries < this.maxRetries) {
                setTimeout(() => {
                    this.img.src = url;
                }, this.retryDelay);
            } else {
                Logger.error(`Failed to load image: ${url}`);
            }
        };
        this.img.src = url;
    }
}

class _Preloader {
    constructor() {
        /** @type {Map<string, PreloadItem>} */
        this.preloadStash = new Map();
    }

    /**
     * @param {string} path
     * @returns {Promise<HTMLImageElement>}
     */
    preload(path) {
        return new Promise((resolve) => {
            Path.afterLoad(() => {
                const url = Path.resolve(path);
                const item = this.preloadStash.get(path);
                if (!item || !item.loaded) {
                    const item = new PreloadItem(url, (img) => resolve(img));
                    this.preloadStash.set(path, item);
                } else if (item.loaded) {
                    resolve(this.preloadStash.get(path).img);
                } else {
                    item.onloads.push((img) => resolve(img));
                }
            });
        });
    }

    /**
     * @param {string} path
     * @param {(arg:HTMLImageElement)=>void} then
     */
    tryResolve(path, then) {
        const item = this.preloadStash.get(path);
        if (!item) {
            this.preload(path);
        } else if (item.loaded) {
            then(item.img);
        }
    }
}

export const Preloader = new _Preloader();

const jsDelivrBase = `https://cdn.jsdelivr.net/${ModInfo.repository?.replace("https://github.com/", "gh/")}`;

const assetPath = (path, version) => {
    if (debugFlag) {
        return `${resourceBaseURL}/${path}?v=${version}`;
    } else {
        return `${jsDelivrBase}@${version}/resources/${path}`;
    }
};

class _Path {
    constructor() {
        /** @type {Record<string, string>} */
        this.overrides = {};
        this.loaded = false;

        /** @type {(() => void)[]} */
        this.afterLoadEvents = [];

        (async () => {
            try {
                const container = await fetchAssetOverrides();
                this.overrides = ((override) => {
                    /** @type {Record<string, string>} */
                    const ret = {};
                    for (const [version, paths] of Object.entries(override)) {
                        for (const path of paths) {
                            ret[path] = assetPath(path, version);
                        }
                    }
                    return ret;
                })(container);
                this.loaded = true;
                for (const fn of this.afterLoadEvents) fn();
                this.afterLoadEvents = [];
            } catch (error) {
                Logger.error(`Failed to fetch asset overrides: ${error}`);
            }
        })();
    }

    /**
     * @param {()=>void} cb
     */
    afterLoad(cb) {
        if (this.loaded) {
            cb();
        } else {
            this.afterLoadEvents.push(cb);
        }
    }

    /**
     * @param {string} path
     * @returns {`${'http://' | 'https://'}${string}`}
     */
    resolve(path) {
        if (path in this.overrides) {
            return /** @type {`${'http://' | 'https://'}${string}`}*/ (this.overrides[path]);
        } else {
            console.warn(`Path "${path}" not found in overrides, using default path.`);
            return `${resourceBaseURL}${fixSeparator(path)}`;
        }
    }
}

/**
 * 播放声音
 * @param {string} src 声音文件路径
 * @param {boolean} [playerInvolved] 是否涉及玩家（玩家触发或者被触发）
 */
export function playItemAudio(src, playerInvolved = false) {
    if (Player.AudioSettings?.PlayItem) {
        if (!Player.AudioSettings?.PlayItemPlayerOnly || playerInvolved) {
            AudioPlayInstantSound(src);
        }
    }
}

export const Path = new _Path();
