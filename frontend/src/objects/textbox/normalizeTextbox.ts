import type { Textbox } from "@common/shapes/Textbox";

export function normalizeTextbox(
    textbox: Textbox
): Textbox {

    let { x, y, width, height } = textbox

    if (width < 0) {
        x += width
        width = Math.abs(width)
    }

    if (height < 0) {
        y += height
        height = Math.abs(height)
    }

    return {
        ...textbox,
        x,
        y,
        width,
        height,
    }
}