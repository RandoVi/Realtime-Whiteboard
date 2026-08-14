import { Laser } from "../shapes";
import { Point } from "../types";
export type LaserCommand = {
    type: "laser";
    laserType: "create";
    laser: Laser;
} | {
    type: "laser";
    laserType: "point";
    laserId: string;
    point: Point;
};
//# sourceMappingURL=LaserCommand.d.ts.map