import type { Point } from "../../types/Types";
import type { Laser } from "./Laser";


export function updateLaserPreview(
    laser: Laser,
    _start: Point,
    current: Point,
) {
    laser.points.push(current);
}