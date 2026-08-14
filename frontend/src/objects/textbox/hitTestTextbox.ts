import type { Textbox } from "@common/shapes/Textbox"
import type { Point } from "@common/types";


export function hitTestTextbox(
    point: Point,
    textbox: Textbox
): boolean {

    return (
        point.x >= textbox.x &&
        point.x <= textbox.x + textbox.width &&
        point.y >= textbox.y &&
        point.y <= textbox.y + textbox.height
    )
}