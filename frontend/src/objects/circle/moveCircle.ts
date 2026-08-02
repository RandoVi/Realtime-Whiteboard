import type { Circle } from "./Circle";

export function moveCircle(
    circle: Circle,
    original: Circle,
    dx: number,
    dy: number,
) {
    circle.x = original.x + dx;
    circle.y = original.y + dy;
}