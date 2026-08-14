import type { Point } from "@common/types";
import type { Circle } from "@common/shapes";
import type { ObjectStyle } from "../ObjectStyle";


export function createCircle(point: Point, style: ObjectStyle): Circle {
    return {
        id: crypto.randomUUID(),
        type: "circle",
        x: point.x,
        y: point.y,
        radius: 0,
        fill: style.fill,
        stroke: style.stroke,
    };
}