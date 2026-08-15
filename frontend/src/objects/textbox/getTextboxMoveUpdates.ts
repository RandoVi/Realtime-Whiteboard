import type { Textbox } from "@common/shapes/Textbox";


export function getTextboxMoveUpdates(
    object: Textbox
) {
    return {
        x: object.x,
        y: object.y,
        rotation: object.rotation,
    }
}