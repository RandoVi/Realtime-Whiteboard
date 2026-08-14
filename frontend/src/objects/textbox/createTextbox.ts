import type { Textbox } from "@common/shapes/Textbox";
import type { Point } from "@common/types";
import type { ObjectStyle } from "../ObjectStyle"


const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 60

const DEFAULT_FONT_SIZE = 24
const DEFAULT_FONT_FAMILY = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const DEFAULT_FONT_WEIGHT = 500

export function createTextbox(
    point: Point,
    style: ObjectStyle
): Textbox {

    return {
        id: crypto.randomUUID(),
        type: "textbox",

        x: point.x,
        y: point.y,

        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,

        text: "Note...",

        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: DEFAULT_FONT_WEIGHT,

        fill: style.stroke,
        background: "#FEF3C7",
    }
}