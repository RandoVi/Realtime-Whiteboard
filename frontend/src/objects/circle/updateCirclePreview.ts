import type { Circle } from "./Circle";
import type { Point } from "../../types/Types";

export function updateCirclePreview(
    circle: Circle,
    start: Point,
    current: Point,
) {
    const dx = current.x - start.x;
    const dy = current.y - start.y;

    circle.radius = Math.sqrt(dx * dx + dy * dy);
}