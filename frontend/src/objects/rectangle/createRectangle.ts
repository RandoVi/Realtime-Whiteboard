import type { Point } from "../../types/Types";
import type { Rectangle } from "./Rectangle";
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