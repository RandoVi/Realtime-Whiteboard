import type { Stroke } from "@common/shapes";
import type { Point } from "@common/types";

import type { ObjectStyle } from "../ObjectStyle";


export function createStroke(
    point: Point,
    style: ObjectStyle
): Stroke {
    return {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [point],
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
    };
}