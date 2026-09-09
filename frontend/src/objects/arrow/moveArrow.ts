import type { Arrow } from "@common/shapes"

export function moveArrow (
    arrow: Arrow,
    original: Arrow,
    dx: number,
    dy: number,
) {
    arrow.x = original.x + dx;
    arrow.y = original.y + dy;
}