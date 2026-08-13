import type { Point } from "../../types/Types";
import type { Arrow } from "./Arrow";

export function hitTestArrow(
    point: Point,
    arrow: Arrow
): boolean {
    return (
        point.x >= arrow.x &&
        point.x <= arrow.x + arrow.width &&
        point.y >= arrow.y &&
        point.y <= arrow.y + arrow.height
    )
}