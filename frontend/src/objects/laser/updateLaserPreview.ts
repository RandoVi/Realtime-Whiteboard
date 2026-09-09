import type { Laser } from "@common/shapes"
import type { Point } from "@common/types"


export function updateLaserPreview(
    laser: Laser,
    _start: Point,
    current: Point,
) {
    laser.points.push({
        point: current,
        createdAt: performance.now(),
    });
}