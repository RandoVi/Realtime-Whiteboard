import type { Point } from "../../types/Types";
import { DEFAULT_FILL, DEFAULT_STROKE_COLOR } from "../defaults";
import type { Rectangle } from "./Rectangle";

export function createRectangle(point: Point): Rectangle {
    return {
        id: crypto.randomUUID(),
        type: "rectangle",
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE_COLOR,
    };
}