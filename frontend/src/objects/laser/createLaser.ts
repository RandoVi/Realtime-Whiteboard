
import type { Point } from "../../types/Types";
import { DEFAULT_STROKE_WIDTH } from "../defaults";
import type { ObjectStyle } from "../ObjectStyle";
import type { Laser } from "./Laser";

export function createLaser(
    _point: Point,
    style: ObjectStyle
): Laser {

    return {
        id: crypto.randomUUID(),

        type: "laser",

        points: [],

        stroke: style.stroke,

        strokeWidth: DEFAULT_STROKE_WIDTH,
    };
}