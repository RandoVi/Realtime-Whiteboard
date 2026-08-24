import type { CanvasText } from "@common/shapes/CanvasText";
import type { Point } from "@common/types";
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint";
import { getTextBounds } from "./getTextBounds";

export function hitTestText(
    point: Point,
    text: CanvasText,
): boolean {

    const bounds =
        getTextBounds(text);

    const localPoint =
        inverseRotatePoint(
            point,
            bounds.center,
            text.rotation,
        );

    return (
        localPoint.x >= bounds.left &&
        localPoint.x <= bounds.right &&
        localPoint.y >= bounds.top &&
        localPoint.y <= bounds.bottom
    );
}