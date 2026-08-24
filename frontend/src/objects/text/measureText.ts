import type { CanvasText } from "@common/shapes/CanvasText";
import { wrapText } from "./wrapText";
import { TEXT_LINE_HEIGHT } from "./textConstants";

export function measureText(
    context: CanvasRenderingContext2D,
    text: CanvasText,
) {
    context.font =
        `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;

    const lines = wrapText(
        context,
        text.text,
        text.width,
    );

    const lineHeight =
        text.fontSize * TEXT_LINE_HEIGHT;

    return {
        width: text.width,
        height: lines.length * lineHeight,
        lines,
        lineHeight,
    };
}