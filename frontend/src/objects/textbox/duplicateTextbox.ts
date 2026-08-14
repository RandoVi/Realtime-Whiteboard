import type { Textbox } from "@common/shapes/Textbox";
export function duplicateTextbox(
    textbox: Textbox
): Textbox {

    return {
        ...textbox,
        id: crypto.randomUUID(),
        x: textbox.x + 20,
        y: textbox.y + 20,
    }
}