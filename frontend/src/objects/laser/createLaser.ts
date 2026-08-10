
import type { Point } from "../../types/Types";
import { DEFAULT_LASER_WIDTH } from "../defaults";
import type { Laser } from "./Laser";

export function createLaser(
    _point: Point,
    color: string
): Laser {

    return {
        id: crypto.randomUUID(),

        type: "laser",

        points: [],

        stroke: color,

        strokeWidth: DEFAULT_LASER_WIDTH,
    };
}