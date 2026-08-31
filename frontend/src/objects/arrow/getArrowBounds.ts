import type { SelectionBounds } from "../../interaction/selection/getSelectionBounds";
import type { Arrow } from "@common/shapes";

export function getArrowBounds(
    object: Arrow
): SelectionBounds {
    const padding = object.strokeWidth;

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
    };
}