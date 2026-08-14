import type { Textbox } from "@common/shapes/Textbox"
import type { Point } from "@common/types";
import type { ResizeHandle } from "../../types/selection"


export function resizeTextbox(
    textbox: Textbox,
    original: Textbox,
    handle: ResizeHandle,
    point: Point
) {

    switch (handle) {

        case "se":
            textbox.width =
                point.x - original.x

            textbox.height =
                point.y - original.y

            break

        case "sw":
            textbox.x = point.x

            textbox.width =
                original.x + original.width - point.x

            textbox.height =
                point.y - original.y

            break

        case "ne":
            textbox.y = point.y

            textbox.width =
                point.x - original.x

            textbox.height =
                original.y + original.height - point.y

            break

        case "nw":
            textbox.x = point.x
            textbox.y = point.y

            textbox.width =
                original.x + original.width - point.x

            textbox.height =
                original.y + original.height - point.y

            break
    }
}