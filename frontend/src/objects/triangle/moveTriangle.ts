import type { Triangle } from "@common/shapes";

export function moveTriangle(
    triangle: Triangle,
    original: Triangle,
    dx: number,
    dy: number,
) {
    triangle.x = original.x + dx;
    triangle.y = original.y + dy;
}