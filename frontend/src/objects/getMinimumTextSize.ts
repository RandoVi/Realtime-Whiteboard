import type { CanvasText, Textbox } from "@common/shapes";
import { TEXT_LINE_HEIGHT } from "./text/textConstants";
import { wrapText } from "./text/wrapText";

type TextObject = CanvasText | Textbox;

export function getMinimumTextSize(
    object: TextObject,
    width: number,
): { width: number; height: number } {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas text measurement is unavailable");
    }

    context.font =
        `${object.fontWeight} ${object.fontSize}px ${object.fontFamily}`;

    const padding = object.type === "textbox" ? 14 : 12;
    const topStrip = object.type === "textbox" ? 36 : 0;

    const words = object.text.match(/\S+/g) ?? [];
    const longestWord = Math.max(
        0,
        ...words.map(word => context.measureText(word).width),
    );

    const minimumWidth = Math.ceil(
        Math.max(40, longestWord + padding * 2 + 2),
    );

    const usableWidth = Math.max(
        1,
        Math.max(width, minimumWidth) - padding * 2,
    );

    const lines = wrapText(
        context,
        object.text,
        usableWidth,
    );

    const lineHeight = object.fontSize * TEXT_LINE_HEIGHT;

    return {
        width: minimumWidth,
        height: Math.ceil(
            topStrip +
            padding * 2 +
            Math.max(1, lines.length) * lineHeight +
            4,
        ),
    };
}