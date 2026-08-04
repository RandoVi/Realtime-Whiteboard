import type { Point } from "../../types/Types";
import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH } from "../defaults";
import type { Stroke } from "./Stroke";



export function createStroke(point: Point): Stroke {
    return {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [point],
        stroke: DEFAULT_STROKE_COLOR,
        strokeWidth: DEFAULT_STROKE_WIDTH,
    };
}