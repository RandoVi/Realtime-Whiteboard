import type { CanvasText } from "@common/shapes/CanvasText";
import type { SelectionBounds } from "../../interaction/selection/getSelectionBounds";

export function getTextBounds(object: CanvasText): SelectionBounds {
    return {
        left: object.x,
        top: object.y,
        right: object.x + object.width,
        bottom: object.y + object.height,
        width: object.width,
        height: object.height,
        center: {
            x: object.x + object.width / 2,
            y: object.y + object.height / 2,
        },
        rotation: object.rotation,
    };
}