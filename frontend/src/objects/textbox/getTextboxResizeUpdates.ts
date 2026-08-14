import type { Textbox } from "./Textbox"

export function getTextboxResizeUpdates(
    object: Textbox
) {
    return {
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
    }
}