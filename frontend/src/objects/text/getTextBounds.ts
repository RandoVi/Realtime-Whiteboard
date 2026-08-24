import type { CanvasText } from "@common/shapes/CanvasText";
import type { SelectionBounds } from "../../interaction/selection/getSelectionBounds";
import { measureText } from "./measureText";

export function getTextBounds(
    object: CanvasText,
): SelectionBounds {

    const canvas =
        document.createElement("canvas");

    const context =
        canvas.getContext("2d");

    if (!context) {
        return {
            left: object.x,
            top: object.y,
            right: object.x + object.width,
            bottom: object.y,

            width: object.width,
            height: 0,

            center: {
                x: object.x + object.width / 2,
                y: object.y,
            },

            rotation: object.rotation,
        };
    }

    const measurement =
        measureText(
            context,
            object,
        );

    const height =
        measurement.height;

    return {
        left: object.x,
        top: object.y,

        right:
            object.x + object.width,

        bottom:
            object.y + height,

        width:
            object.width,

        height,

        center: {
            x:
                object.x +
                object.width / 2,

            y:
                object.y +
                height / 2,
        },

        rotation:
            object.rotation,
    };
}