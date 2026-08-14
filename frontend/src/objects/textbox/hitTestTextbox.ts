import type { Point } from "../../types/Types"
import type { Textbox } from "./Textbox"

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