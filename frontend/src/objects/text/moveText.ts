import type { CanvasText } from "@common/shapes/CanvasText";

export function moveText(
    text: CanvasText,
    original: CanvasText,
    dx: number,
    dy: number,
) {
    text.x = original.x + dx;
    text.y = original.y + dy;
}