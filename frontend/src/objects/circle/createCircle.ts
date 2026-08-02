import type { Point } from "../../types/Types";
import { DEFAULT_FILL, DEFAULT_STROKE_COLOR } from "../defaults";
import type { Circle } from "./Circle";



export function createCircle(point: Point): Circle {
    return {
        id: crypto.randomUUID(),
        type: "circle",
        x: point.x,
        y: point.y,
        radius: 0,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE_COLOR,
    };
}