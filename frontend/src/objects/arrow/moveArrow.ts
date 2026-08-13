import type { Arrow } from "./Arrow";

export function moveArrow (
    arrow: Arrow,
    original: Arrow,
    dx: number,
    dy: number,
) {
    arrow.x = original.x + dx;
    arrow.y = original.y + dy;
}