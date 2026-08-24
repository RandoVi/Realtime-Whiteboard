import type { CanvasText } from "@common/shapes/CanvasText";

export function getTextMoveUpdates(
    object: CanvasText
) {
    return {
        x: object.x,
        y: object.y,
        rotation: object.rotation,
    };
}