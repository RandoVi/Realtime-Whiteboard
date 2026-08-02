import type { Stroke } from "./Stroke";
import type { Point } from "../../types/Types";

export function updateStrokePreview(
    stroke: Stroke,
    current: Point,
) {
    stroke.points.push(current);
}