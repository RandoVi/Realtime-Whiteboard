import type { Point } from "@common/types";
import type { Triangle } from "@common/shapes";
import type { ObjectStyle } from "../ObjectStyle";


export function createTriangle(point: Point, style: ObjectStyle): Triangle {
    return {
        id: crypto.randomUUID(),
        type: "triangle",
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        fill: style.fill,
        stroke: style.stroke,
    };
}