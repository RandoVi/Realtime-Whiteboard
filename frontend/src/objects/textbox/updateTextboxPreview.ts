import type { Point } from "../../types/Types"
import type { Textbox } from "./Textbox"

export function updateTextboxPreview(
    textbox: Textbox,
    start: Point,
    current: Point,
) {
    const width = current.x - start.x;
    const height = current.y - start.y;

    if (width < 0) {
        textbox.x = current.x;
        textbox.width = Math.abs(width);
    } else {
        textbox.x = start.x;
        textbox.width = width;
    }

    if (height < 0) {
        textbox.y = current.y;
        textbox.height = Math.abs(height);
    } else {
        textbox.y = start.y;
        textbox.height = height;
    }
}