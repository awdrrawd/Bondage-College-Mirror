import { ChatHistoryTranslator, HTMLBodyObserver } from "./utils";
import { BCXHelp } from "./BCX";
import { FUSAM } from "./FUSAM";
import { DOGS } from "./DOGS";
import { FetishShare } from "./FetishShare";
import { EBCHHelp } from "./EBCH";
import { MBS } from "./MBS";

export function setup() {
    ChatHistoryTranslator.registerTranslationFunc(BCXHelp);
    ChatHistoryTranslator.registerTranslationFunc(EBCHHelp);
    HTMLBodyObserver.registerModifier(FUSAM);
    HTMLBodyObserver.registerModifier(DOGS);
    HTMLBodyObserver.registerModifier(MBS);
    HTMLBodyObserver.registerModifier(FetishShare);
}
