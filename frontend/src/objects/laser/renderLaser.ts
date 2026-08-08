import type { Camera } from "../../types/Types";
import type { Laser } from "./Laser";

const POINT_LIFETIME = 2000;

export function renderLaser(
    context: CanvasRenderingContext2D,
    laser: Laser,
    camera: Camera,
) {
    const now = performance.now();

    const visiblePoints = laser.points.filter(
        ({ createdAt }) =>
            now - createdAt < POINT_LIFETIME
    );

    if (visiblePoints.length < 2) {
        return;
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
}