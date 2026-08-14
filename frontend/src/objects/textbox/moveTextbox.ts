import type { Textbox } from "./Textbox"

export function moveTextbox(
    textbox: Textbox,
    original: Textbox,
    dx: number,
    dy: number,
) {

    textbox.x = original.x + dx
    textbox.y = original.y + dy
}