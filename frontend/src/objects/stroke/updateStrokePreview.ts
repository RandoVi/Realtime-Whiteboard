import type { Stroke } from "@common/shapes";
import type { Point } from "@common/types";

export function updateStrokePreview(
    stroke: Stroke,
    _start: Point,
    current: Point,
) {
    stroke.points.push(current)
}