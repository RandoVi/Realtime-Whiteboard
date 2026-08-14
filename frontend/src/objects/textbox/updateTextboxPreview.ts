import type { Point } from "../../types/Types"
import type { Textbox } from "./Textbox"

export function updateTextboxPreview(
    textbox: Textbox,
    start: Point,
    current: Point,
) {

    textbox.width = current.x - start.x
    textbox.height = current.y - start.y
}