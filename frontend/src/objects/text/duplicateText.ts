import type { CanvasText } from "@common/shapes/CanvasText";

export function duplicateText(
    text: CanvasText
): CanvasText {
    return {
        ...text,
        id: crypto.randomUUID(),
        x: text.x + 20,
        y: text.y + 20,
    };
}