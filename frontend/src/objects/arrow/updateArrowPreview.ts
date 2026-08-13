import type { Point } from "../../types/Types";
import type { Arrow } from "./Arrow";

export function updateArrowPreview(
    arrow: Arrow,
    start: Point,
    current: Point,
) {
    arrow.width = current.x - start.x;
    arrow.height = current.y - start.y;
}