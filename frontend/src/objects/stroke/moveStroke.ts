import type { Stroke } from "./Stroke";

export function moveStroke(
    stroke: Stroke,
    original: Stroke,
    dx: number,
    dy: number,
) {
    stroke.points = original.points.map(point => ({
        x: point.x + dx,
        y: point.y + dy,
    }));
}