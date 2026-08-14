import type { Point } from "@common/types"
import type { Rectangle } from "@common/shapes"
import type { ObjectStyle } from "../ObjectStyle";


export function createRectangle(point: Point, style: ObjectStyle): Rectangle {
    return {
        id: crypto.randomUUID(),
        type: "rectangle",
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        fill: style.fill,
        stroke: style.stroke,
    };
}