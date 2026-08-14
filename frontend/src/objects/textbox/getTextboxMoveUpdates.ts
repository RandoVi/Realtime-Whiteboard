import type { Textbox } from "./Textbox"

export function getTextboxMoveUpdates(
    object: Textbox
) {
    return {
        x: object.x,
        y: object.y,
    }
}