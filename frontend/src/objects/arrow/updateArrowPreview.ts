import type { Arrow } from "@common/shapes";
import type { Point } from "@common/types";

export function updateArrowPreview(
    arrow: Arrow,
    start: Point,
    current: Point,
) {
    arrow.width = current.x - start.x;
    arrow.height = current.y - start.y;
}