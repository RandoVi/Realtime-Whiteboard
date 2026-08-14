import type { ResizeHandle } from "../../types/selection";
import type { Arrow } from "@common/shapes";
import type { Point } from "@common/types";

export function resizeArrow(
    arrow: Arrow,
    original: Arrow,
    handle: ResizeHandle,
    point: Point
) {
    switch (handle) {

        case 'se':
            arrow.width =
                point.x - original.x

            arrow.height =
                point.y - original.y

            break


        case 'sw':
            arrow.x = point.x

            arrow.width =
                original.x + original.width - point.x

            arrow.height =
                point.y - original.y

            break


        case 'ne':
            arrow.y = point.y

            arrow.width =
                point.x - original.x

            arrow.height =
                original.y + original.height - point.y

            break


        case 'nw':
            arrow.x = point.x
            arrow.y = point.y

            arrow.width =
                original.x + original.width - point.x

            arrow.height =
                original.y + original.height - point.y

            break
    }
}