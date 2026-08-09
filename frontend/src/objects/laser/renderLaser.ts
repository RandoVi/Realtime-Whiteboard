import type { Camera } from "../../types/Types";
import type { Laser } from "./Laser";

const POINT_LIFETIME = 2000;

export function renderLaser(
    context: CanvasRenderingContext2D,
    laser: Laser,
    camera: Camera,
): boolean {

    const now = performance.now();

    // Laser was created, but no points have arrived yet.
    // It must remain alive so incoming points can be appended.
    if (laser.points.length === 0) {
        return true;
    }

    const visiblePoints = laser.points.filter(
        ({ createdAt }) =>
            now - createdAt < POINT_LIFETIME
    );

    // Points existed, but they have all expired.
    if (visiblePoints.length === 0) {
        return false;
    }

    // One point isn't enough to draw a line,
    // but the laser is still alive.
    if (visiblePoints.length < 2) {
        return true;
    }

    context.beginPath();

    context.strokeStyle = laser.stroke;
    context.lineWidth = laser.strokeWidth;
    context.lineCap = "round";
    context.lineJoin = "round";

    const first = visiblePoints[0].point;

    context.moveTo(
        first.x * camera.scale + camera.offsetX,
        first.y * camera.scale + camera.offsetY
    );

    for (let i = 1; i < visiblePoints.length; i++) {

        const point = visiblePoints[i].point;

        context.lineTo(
            point.x * camera.scale + camera.offsetX,
            point.y * camera.scale + camera.offsetY
        );
    }

    context.stroke();

    return true;
}