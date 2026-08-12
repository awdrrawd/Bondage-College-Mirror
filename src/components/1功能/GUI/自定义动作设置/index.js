import { BaseSubscreen } from "../gui";

import { Logger } from "@mod-utils/log";
import { activityDataManager } from "../../../保存数据/保存动作";
import { 移除清空输入框 } from "../utils";
import { Preloader } from "../../../../resouce";
import { RDrawImageResize, RMouseIn } from "../RDraw";
import { 自定义动作设置_动作 } from "./动作";
import { 自定义动作设置_删除 } from "./删除";
import { i18n } from "../i18n";

export class 自定义动作设置 extends BaseSubscreen {
    constructor(prev) {
        super(prev);

        /** @type {'动作' | '删除'} */
        this.当前页面 = "动作";

        /** @type {AssetGroup | undefined} */
        this.targetGroup = undefined;

        /** @type { BaseSubscreen } */
        this.curScreen = new 自定义动作设置_动作(() => this.targetGroup);

        this.exitButtonRect = { X: 114, Y: 75, W: 90, H: 90 };
    }

    run() {
        Preloader.tryResolve("image/选择界面.png", (img) => RDrawImageResize({ X: 0, Y: 0, W: 2000, H: 1000 }, img));
        Preloader.tryResolve("image/条线.png", (img) => RDrawImageResize({ X: 0, Y: 0, W: 2000, H: 1000 }, img));
        Preloader.tryResolve("image/返回白.png", (img) => RDrawImageResize(this.exitButtonRect, img));
        DrawText(`- ${i18n("Setting::Main::CustomActTile")} -`, 1000, 125, "Black");

        const DisplayBase = { X: 370, Y: 50 };
        const DisplayRatio = 0.9;

        DrawCharacter(Player, DisplayBase.X, DisplayBase.Y, DisplayRatio, false); // 绘制主要标签和玩家
        if (Player.ArousalSettings.Active !== "Inactive") {
            AssetGroup.filter(
                (g) => g.IsItem() && !g.MirrorActivitiesFrom && AssetActivitiesForGroup("Female3DCG", g.Name).length
            ).forEach((g) => {
                const targeted = this.targetGroup === g;
                g.Zone.forEach((z) => {
                    const [X, Y, W, H] = z.map((x) => x * DisplayRatio);
                    if (targeted) DrawEmptyRect(DisplayBase.X + X, DisplayBase.Y + Y, W, H, "cyan");
                    else DrawEmptyRect(DisplayBase.X + X, DisplayBase.Y + Y, W, H, "#80808080");
                });
            });
        }

        if (MouseIn(80, 210, 160, 100)) {
            Preloader.tryResolve("image/白箭头右.png", (img) => DrawImageResize(img, 270, 232, 90, 50));
            DrawText(i18n("Setting::Act::Act"), 220, 260, "White");
        } else {
            if (this.当前页面 !== `动作`) {
                DrawText(i18n("Setting::Act::Act"), 160, 260, "White");
            }
        }

        if (MouseIn(80, 710, 160, 100)) {
            Preloader.tryResolve("image/白箭头右.png", (img) => DrawImageResize(img, 270, 730, 90, 50));
            DrawText(i18n("General::Delete"), 220, 760, "White");
        } else {
            if (this.当前页面 !== `删除`) {
                DrawText(i18n("General::Delete"), 160, 760, "White");
            }
        }

        this.curScreen?.run();
    }
    click() {
        if (RMouseIn(this.exitButtonRect)) {
            activityDataManager()?.save();
            Logger.info("已存储进个人设置");
            this.exit();
        }

        const DisplayBase = { X: 370, Y: 50 };
        const DisplayRatio = 0.9;
        if (MouseIn(DisplayBase.X, DisplayBase.Y, 500, 1000)) {
            this.targetGroup = AssetGroup.filter(
                (g) => g.IsItem() && !g.MirrorActivitiesFrom && AssetActivitiesForGroup("Female3DCG", g.Name).length
            ).find((g) =>
                g.Zone.map((rect) => rect.map((x) => x * DisplayRatio)).some(([X, Y, W, H]) =>
                    MouseIn(DisplayBase.X + X, DisplayBase.Y + Y, W, H)
                )
            );
        }

        if (MouseIn(80, 210, 160, 100) && this.当前页面 !== "动作") {
            this.当前页面 = "动作";
            this.curScreen?.unload();
            this.curScreen = new 自定义动作设置_动作(() => this.targetGroup);
        } else if (MouseIn(80, 710, 160, 100) && this.当前页面 !== "删除") {
            this.当前页面 = "删除";
            this.curScreen?.unload();
            this.curScreen = new 自定义动作设置_删除();
        }

        this.curScreen?.click();
    }
    unload() {
        移除清空输入框("笨蛋Luzi_activityName");
        移除清空输入框("笨蛋Luzi_targetSelfText");
        移除清空输入框("笨蛋Luzi_targetText");
    }
}
