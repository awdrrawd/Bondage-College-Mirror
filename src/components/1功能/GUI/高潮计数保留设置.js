import { Preloader } from "../../../resouce";
import { BaseSubscreen } from "./gui";
import { 设置高潮数据, 高潮数据开关 } from "../../保存数据/保存高潮";
import { RDrawCheckbox, RDrawIconButton, RDrawImageResize, RDrawText, RMouseIn } from "./RDraw";
import { i18n } from "./i18n";

export class 高潮计数保留设置 extends BaseSubscreen {
    constructor(prev) {
        super(prev);

        this.exitButtonRect = { X: 114, Y: 75, W: 90, H: 90 };

        this.checkBoxRect = { X: 250, Y: 200, W: 64, H: 64 };
        this.clearButtonRect = { X: 250, Y: 290, W: 390, H: 90 };

        this.saveCraftingButtonRect = { X: 1050, Y: 290, W: 390, H: 90 };
        this.loadCraftingButtonRect = { X: 1450, Y: 290, W: 390, H: 90 };
    }
    run() {
        Preloader.tryResolve("image/选择界面.png", (img) => RDrawImageResize({ X: 0, Y: 0, W: 2000, H: 1000 }, img));
        Preloader.tryResolve("image/返回白.png", (img) => RDrawImageResize(this.exitButtonRect, img));

        DrawText(`- ${i18n("Setting::Main::MiscTitle")} -`, 1000, 125, "Black");

        RDrawText(
            { X: this.checkBoxRect.X + this.checkBoxRect.W + 10, Y: 232 },
            i18n("Setting::Misc::KeepArousal"),
            "#FFFFFF"
        );
        RDrawCheckbox(this.checkBoxRect, 高潮数据开关());

        RDrawIconButton(this.clearButtonRect, i18n("Setting::Misc::ClearArousal"), "White", "Icons/Trash.png");
        RDrawIconButton(
            this.saveCraftingButtonRect,
            i18n("Setting::Misc::SaveCrafting"),
            "Gray",
            "Icons/Crafting.png",
            i18n("Setting::Misc::SaveCrafting::Retired"),
            true
        );
        RDrawIconButton(
            this.loadCraftingButtonRect,
            i18n("Setting::Misc::LoadCrafting"),
            "Gray",
            "Icons/Crafting.png",
            i18n("Setting::Misc::SaveCrafting::Retired"),
            true
        );
    }
    click() {
        if (RMouseIn(this.exitButtonRect)) this.exit();
        else if (RMouseIn(this.checkBoxRect)) 设置高潮数据({ 高潮开关: !高潮数据开关() });
        else if (RMouseIn(this.clearButtonRect)) 设置高潮数据({ 高潮次数: 0 });
    }
}
