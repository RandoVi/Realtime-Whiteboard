import type { CanvasText } from "@common/shapes/CanvasText";

export function getTextResizeUpdates(
    object: CanvasText
) {
    return {
        x: object.x,
        y: object.y,
        width: object.width,
        rotation: object.rotation,
    };
}