import type { Point } from "../../types/Types";

import type { Circle } from "./Circle";
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