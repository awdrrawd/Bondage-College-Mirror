import { ChatRoomEvents } from "@sugarch/bc-event-handler";
import { messager } from "../../messager";

/**
 * @typedef { "nm" | "bili" | "ytb" | "phb" } ShareType
 */

/** @type {Record<ShareType, { displayName: string | (() => string), get: (info: string) => string }>} */
const frame = {
    nm: {
        displayName: () => (TranslationLanguage === "CN" ? "网易云" : "Netease Cloud Music"),
        get: (Id) =>
            `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=${Id}&auto=0&height=66"></iframe>`,
    },
    bili: {
        displayName: "Bilibili",
        get: (info) => {
            const IDs = JSON.parse(info);
            return `<iframe width="100%" height="100%" src="//player.bilibili.com/player.html?autoplay=0&isOutside=true&aid=${IDs[0]}&bvid=${IDs[1]}&cid=${IDs[2]}&p=${IDs[3]}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>`;
        },
    },
    ytb: {
        displayName: "Youtube",
        get: (info) => {
            const IDs = JSON.parse(info);
            const fakeSI = Math.random().toString(36).substring(2);
            return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${IDs[0]}?si=${fakeSI}" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
        },
    },
    phb: {
        displayName: "Pornhub",
        get: (Id) =>
            `<iframe width="100%" height="100%" src="https://www.pornhub.com/embed/${Id}" frameborder="0"  scrolling="no" allowfullscreen></iframe>`,
    },
};

/** @type {(str: string | (()=>string))=>string} */
const valuify = (str) => (typeof str === "function" ? str() : str);

const flex = "display: flex; flex-direction: column;";
const h2 = "font-size: min(2vw,4vh); color: rgb(32, 87, 129);";
const h3 = "font-size: min(1.5vw,3vh); color: rgb(79, 149, 157);";
const hx = "font-size: min(1vw,2vh);";

const margin = (top, bottom) => `margin-top: ${top}; margin-bottom: ${bottom};`;
const def_margin = margin("0.2em", "0");

function buildExampe(title, steps, example_prefix, example, em) {
    /* eslint-disable indent */
    return `
    <div style="${def_margin} ${flex}">
    <h3 style="${def_margin} line-height: 1; ${h3}">${title}</h3>
    ${
        example.length
            ? `<ul style="padding-top: 0; ${def_margin} line-height: 1; ${flex}">
    ${steps.map((step) => `<li style="line-height: 1; ${hx}">${step}</li>`).join("")}
    </ul>`
            : ""
    }
    <p style="${def_margin} ${flex} ${hx}">
    <span style="">${example_prefix}</span>
    <code style="${def_margin} margin-inline-start: 2em; ${hx}">${example}</code></p>
    ${em ? `<em style="${def_margin} ${hx}">（${em}）</em>` : ""}
    </div>
    `;
    /* eslint-enable indent */
}

const i18n = {
    CN: {
        shareHelp: `
<div style="${flex}">
  <h2 style="${margin("0.5em", "0")} line-height: 1; ${h2}">分享链接指令帮助</h2>
  <div style="${flex}">
    ${buildExampe("基本格式", [], "示例：", "/分享 [链接]")}
    ${buildExampe(
        "网易云音乐",
        [
            "网页版：打开歌曲详情页 → 播放器下方蓝色「生成外链播放器」→ 点击「复制代码」",
            "客户端：点击歌曲分享 → 复制链接",
        ],
        "示例：",
        "/分享 https://music.163.com/song?id=******",
        "在发送前会过滤掉其他URL参数，不会发送用户ID信息"
    )}
    ${buildExampe(
        "哔哩哔哩",
        ["点击视频下方分享按钮 → 选择「嵌入代码」"],
        "示例：",
        "/分享 &lt;iframe src=&quot;//...aid=******&amp;bvid=******&amp;cid=******...&gt;&lt;/iframe&gt;"
    )}
    ${buildExampe("YouTube", ["点击分享按钮 → 复制链接"], "示例：", "/分享 https://youtu.be/******?si=******")}
    ${buildExampe(
        "PornHub",
        ["复制浏览器地址栏的网址"],
        "示例：",
        "/分享 https://cn.pornhub.com/view_video.php?viewkey=**********"
    )}
  </div>
</div>
`,
        shareUnsupport: "不支持你分享的链接，目前支持的有：%s。使用'/分享'获取帮助! ",
        shareInfo: "SourceCharacter 发送了一个 SourceType 嵌入分享 ╰(*°▽°*)╯: SourceLink",
    },
    EN: {
        shareHelp: `
<div style="${flex}">
  <h2 style="margin: 5px;line-height: 1; ${h2}">Share Link Command Help</h2>
  <div style="${flex}">
    ${buildExampe("Basic Format", [], "Example：", "/sharelink [link]")}
    ${buildExampe(
        "Netease Cloud Music",
        [
            "Web: Open the song details page → Blue 'Generate external link player' below the player → Click 'Copy Code'",
            "Client: Click the song share → Copy link",
        ],
        "Example：",
        "/sharelink https://music.163.com/song?id=******",
        "Other URL parameters will be filtered out before sending, and user ID information will not be sent"
    )}
    ${buildExampe(
        "Bilibili",
        ["Click the share button below the video → Select 'Embed Code'"],
        "Example：",
        "/sharelink &lt;iframe src=&quot;//...aid=******&amp;bvid=******&amp;cid=******...&gt;&lt;/iframe&gt;"
    )}
    ${buildExampe(
        "YouTube",
        ["Click the share button → Copy the link or copy the URL in the browser address bar"],
        "Example：",
        "/sharelink https://youtu.be/******"
    )}
    ${buildExampe(
        "PornHub",
        ["Copy the URL in the browser address bar"],
        "Example：",
        "/sharelink https://www.pornhub.com/view_video.php?viewkey=**********"
    )}
  </div>
</div>
`,
        shareUnsupport:
            "The link you shared is not supported, currently supported are: %s. Use '/sharelink' to get help! ",
        shareInfo: "SourceCharacter sends a SourceType embedded share ╰(*°▽°*)╯: SourceLink",
    },
};

/**
 * @param {"CN" | "EN"} lang
 * @returns {Record<string, string>}
 */
function text(lang) {
    return i18n[lang] ?? i18n["EN"];
}
/**
 * @param {"CN" | "EN"} lang
 */
function sendShareHelp(lang = "CN") {
    const shareHelp = text(lang).shareHelp;
    ChatRoomSendLocal(shareHelp);
}

function shareErrReport(lang) {
    const supportList = Object.values(frame)
        .map((v) => valuify(v.displayName))
        .join(", ");
    ChatRoomSendLocal(text(lang).shareUnsupport.replace("%s", supportList));
}

/**
 * @typedef { { linkType: ShareType, info: string } } ShareInfo
 */

/**
 * 处理发送分享媒体
 * @param {string} parsed 传入命令的参数
 * @param {"CN" | "EN"} lang
 * @returns void
 */
function shareHandle(parsed, lang = "CN") {
    const shareContent = parsed;

    /** @type {[ShareInfo, string] | undefined} */
    const result = (() => {
        if (shareContent.includes("music.163.com")) {
            const match = shareContent.match(/[?&]id=(\d+)/); // 拿到歌曲ID   用户ID不能发出去 保护隐私
            if (match)
                return [
                    {
                        linkType: "nm",
                        info: btoa(match[1]),
                    },
                    `https://music.163.com/song?id=${match[1]}`,
                ];
        } else if (shareContent.startsWith('<iframe src="//player.bilibili.com/player.html')) {
            const src = shareContent.match(/src="([^"]+)"/)?.[1];
            if (!src) return undefined;
            try {
                const shareUrl = new URL(window.location.protocol + src);
                const args = ["aid", "bvid", "cid", "p"].map((key) => shareUrl.searchParams.get(key));
                if (args.some((v) => !v)) return undefined;
                return [
                    {
                        linkType: "bili",
                        info: btoa(JSON.stringify(args)),
                    },
                    `https://www.bilibili.com/video/${args[1]}`,
                ];
            } catch (e) {
                console.error("Error parsing Bilibili iframe:", e);
                return undefined;
            }
        } else if (shareContent.startsWith("https://youtu.be/")) {
            const match = shareContent.match(/youtu\.be\/([\w-]+)/);
            if (match)
                return [
                    { linkType: "ytb", info: btoa(JSON.stringify([match[1], match[2]])) },
                    `https://youtu.be/${match[1]}`,
                ];
        } else if (shareContent.startsWith("https://www.youtube.com/watch")) {
            const match = shareContent.match(/[?&]v=([\w-]+)/);
            if (match)
                return [{ linkType: "ytb", info: btoa(JSON.stringify([match[1]])) }, `https://youtu.be/${match[1]}`];
        } else if (shareContent.includes("pornhub.com/view_video.php")) {
            const match = shareContent.match(/viewkey=([A-Za-z0-9]+)/);
            if (match)
                return [
                    { linkType: "phb", info: btoa(match[1]) },
                    `https://pornhub.com/view_video.php?viewkey=${match[1]}`,
                ];
        }

        return undefined;
    })();

    if (!result) {
        shareErrReport(lang);
    } else {
        const [sendv, src] = result;
        // 发送
        ServerSend("ChatRoomChat", {
            Type: "Hidden",
            Content: "Share_Link",
            Dictionary: [sendv],
            Sender: Player.MemberNumber,
        });
        // 发送消息
        messager.action(text(lang).shareInfo, {
            source: Player,
            text: [
                { tag: "SourceType", text: valuify(frame[sendv.linkType].displayName) },
                { tag: "SourceLink", text: src },
            ],
        });
        // 清理输入框内容
        ElementValue("InputChat", "");
    }
}

export default function () {
    ChatRoomEvents.on("Hidden", (message) => {
        const { Content, Dictionary, Sender } = message;
        if (Content === "Share_Link") {
            const { linkType, info } = /** @type { any } */ (Dictionary[0]);
            const result = frame[linkType]?.get(atob(info));
            if (result) {
                ChatRoomMessage({
                    Type: "LocalMessage",
                    Sender,
                    Content: `<div style="width: 100%; aspect-ratio: 4 / 3;">${result}</div>`,
                });
            }
        }
    });

    CommandCombine({
        Tag: "分享",
        Description: '分享媒体链接,使用"/分享"获取帮助! ',
        Action: (parsed, msg) => {
            if (parsed === "") sendShareHelp();
            else {
                const ori = msg.substring(msg.indexOf(" ") + 1);
                shareHandle(ori);
            }
        },
    });

    CommandCombine({
        Tag: "sharelink",
        Description: 'Share media link, use "/sharelink" to get help! ',
        Action: (parsed, msg) => {
            if (parsed === "") sendShareHelp("EN");
            else {
                const ori = msg.substring(msg.indexOf(" ") + 1);
                shareHandle(ori, "EN");
            }
        },
    });
}
