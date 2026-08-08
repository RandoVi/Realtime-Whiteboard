import type { Point } from "../../types/Types";
import { DEFAULT_STROKE_WIDTH } from "../defaults";
import type { ObjectStyle } from "../ObjectStyle";
import type { Laser } from "./Laser";


export function createLaser(
    point: Point,
    style: ObjectStyle
): Laser {

    return {
        id: crypto.randomUUID(),

        type: "laser",

        points: [
            {
                point,
                createdAt: performance.now(),
            }
        ],

        stroke: style.stroke,

        strokeWidth: DEFAULT_STROKE_WIDTH,

        createdAt: performance.now(),
    };
}