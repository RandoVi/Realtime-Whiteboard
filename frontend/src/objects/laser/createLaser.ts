import type { Point } from "@common/types"
import { DEFAULT_LASER_WIDTH } from "../defaults";
import type { ObjectStyle } from "../ObjectStyle";
import type { Laser } from "@common/shapes"

export function createLaser(
    _point: Point,
    style: ObjectStyle
): Laser {

    return {
        id: crypto.randomUUID(),

        type: "laser",

        points: [],

        stroke: style.stroke,

        strokeWidth: DEFAULT_LASER_WIDTH,
    };
}