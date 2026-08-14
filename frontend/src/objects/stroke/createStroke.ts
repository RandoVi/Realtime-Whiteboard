import type { Stroke } from "@common/shapes";
import type { Point } from "@common/types";
import { DEFAULT_STROKE_WIDTH } from "../defaults";

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