
import type { Point } from "@common/types";
import type { Textbox } from "@common/shapes";

import { getMinimumTextSize } from "../getMinimumTextSize";

export function updateTextboxPreview(
    textbox: Textbox,
    start: Point,
    current: Point,
) {
    const minimumWidth = getMinimumTextSize(textbox, 0).width;

    const width = Math.max(
        Math.abs(current.x - start.x),
        minimumWidth,
    );

    const minimumHeight = getMinimumTextSize(textbox, width).height;

    const height = Math.max(
        Math.abs(current.y - start.y),
        minimumHeight,
    );

    textbox.width = width;
    textbox.height = height;

    textbox.x = current.x < start.x
        ? start.x - width
        : start.x;

    textbox.y = current.y < start.y
        ? start.y - height
        : start.y;
}
