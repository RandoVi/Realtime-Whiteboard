import type { Stroke } from "./Stroke";
import type { Point } from "../../types/Types";

export function updateStrokePreview(
    stroke: Stroke,
    _start: Point,
    current: Point,
) {
    stroke.points.push(current)
}