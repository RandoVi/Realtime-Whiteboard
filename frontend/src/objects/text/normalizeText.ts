import type { CanvasText } from "@common/shapes/CanvasText";

export function normalizeText(text: CanvasText): CanvasText {
    let { x, y, width, height } = text;

    if (width < 0) {
        x += width;
        width = -width;
    }

    if (height < 0) {
        y += height;
        height = -height;
    }

    return { ...text, x, y, width, height };
}