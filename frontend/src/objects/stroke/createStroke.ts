import type { Point } from "../../types/Types";
import { DEFAULT_STROKE_WIDTH } from "../defaults";
import type { Stroke } from "./Stroke";
import type { ObjectStyle } from "../ObjectStyle";


export function createStroke(point: Point, style: ObjectStyle): Stroke {
    return {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [point],
        stroke: style.stroke,
        strokeWidth: DEFAULT_STROKE_WIDTH,
    };
}