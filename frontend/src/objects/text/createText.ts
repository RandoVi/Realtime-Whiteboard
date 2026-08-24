import type { CanvasText } from "@common/shapes/CanvasText";
import type { Point } from "@common/types";
import type { ObjectStyle } from "../ObjectStyle";

const DEFAULT_WIDTH = 250;

const DEFAULT_FONT_SIZE = 24;

const DEFAULT_FONT_FAMILY =
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const DEFAULT_FONT_WEIGHT = 500;

export function createText(
    point: Point,
    style: ObjectStyle
): CanvasText {
    return {
        id: crypto.randomUUID(),
        type: "text",

        x: point.x,
        y: point.y,

        width: DEFAULT_WIDTH,
        rotation: 0,

        text: "Text...",

        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: DEFAULT_FONT_WEIGHT,

        fill: style.stroke,
    };
}