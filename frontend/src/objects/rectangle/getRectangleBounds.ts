import type { Rectangle } from "@common/shapes"
import type { SelectionBounds } from "../../interaction/selection/getSelectionBounds"

export function getRectangleBounds(
    object: Rectangle
): SelectionBounds {

    const strokePadding =
        object.strokeWidth / 2;

    return {
        left:
            object.x - strokePadding,

        top:
            object.y - strokePadding,

        right:
            object.x +
            object.width +
            strokePadding,

        bottom:
            object.y +
            object.height +
            strokePadding,

        width:
            object.width +
            object.strokeWidth,

        height:
            object.height +
            object.strokeWidth,

        center: {
            x:
                object.x +
                object.width / 2,

            y:
                object.y +
                object.height / 2,
        },

        rotation: object.rotation,
    };
}

