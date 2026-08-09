import type { Point } from "../../../types/Types";
import type { Laser } from "../../../objects/laser/Laser";

export type LaserCommand =
    | {
        type: "laser";
        laserType: "create";
        laser: Laser;
    }
    | {
        type: "laser";
        laserType: "point";
        laserId: string;
        point: Point;
    };