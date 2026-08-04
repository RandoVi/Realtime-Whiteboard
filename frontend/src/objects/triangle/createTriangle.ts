import type { Point } from "../../types/Types";
import { DEFAULT_FILL, DEFAULT_STROKE_COLOR } from "../defaults";
import type { Triangle } from "./Triangle";

export function createTriangle(point: Point): Triangle {
    return {
        id: crypto.randomUUID(),
        type: "triangle",
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE_COLOR,
    };
}