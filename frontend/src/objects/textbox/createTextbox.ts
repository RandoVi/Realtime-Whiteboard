import type { Point } from "../../types/Types"
import type { ObjectStyle } from "../ObjectStyle"
import type { Textbox } from "./Textbox"

const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 60

const DEFAULT_FONT_SIZE = 16
const DEFAULT_FONT_FAMILY = "Arial"
const DEFAULT_FONT_WEIGHT = 400

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

        text: "Text",

        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
        fontWeight: DEFAULT_FONT_WEIGHT,

        fill: style.stroke,
    }
}