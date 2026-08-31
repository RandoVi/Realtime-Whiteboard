import type { Triangle } from "@common/shapes";
import type { SelectionBounds } from "../../interaction/selection/getSelectionBounds"

export function getTriangleBounds(
    object: Triangle
): SelectionBounds {
    const padding = object.strokeWidth / 2;

    return {
        left: object.x - padding,
        top: object.y - padding,
        right: object.x + object.width + padding,
        bottom: object.y + object.height + padding,

        width: object.width + padding * 2,
        height: object.height + padding * 2,

        center: {
            x: object.x + object.width / 2,
            y: object.y + object.height / 2,
        },

        rotation: object.rotation,
    };
}