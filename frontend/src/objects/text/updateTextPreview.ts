
import type { CanvasText } from "@common/shapes/CanvasText";
import type { Point } from "@common/types";

import { getMinimumTextSize } from "../getMinimumTextSize";

export function updateTextPreview(
    text: CanvasText,
    start: Point,
    current: Point,
) {
    const minimumWidth = getMinimumTextSize(text, 0).width;

    const width = Math.max(
        Math.abs(current.x - start.x),
        minimumWidth,
    );

    const minimumHeight = getMinimumTextSize(text, width).height;

    const height = Math.max(
        Math.abs(current.y - start.y),
        minimumHeight,
    );

    text.width = width;
    text.height = height;

    text.x = current.x < start.x
        ? start.x - width
        : start.x;

    text.y = current.y < start.y
        ? start.y - height
        : start.y;
}
