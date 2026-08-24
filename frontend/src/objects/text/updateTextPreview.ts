import type { CanvasText } from "@common/shapes/CanvasText";
import type { Point } from "@common/types";

export function updateTextPreview(
    text: CanvasText,
    start: Point,
    _current: Point,
) {
    text.x = start.x;
    text.y = start.y;
}