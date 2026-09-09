import type { Arrow } from "@common/shapes";

export function getArrowResizeUpdates(
    object: Arrow
) {
    return {
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
        rotation: object.rotation,
    }
}