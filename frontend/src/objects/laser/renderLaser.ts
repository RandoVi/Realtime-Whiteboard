import type { Camera } from "../../types/Types";
import type { Laser } from "./Laser";

const POINT_LIFETIME = 2000;

export function renderLaser(
    context: CanvasRenderingContext2D,
    laser: Laser,
    camera: Camera,
): boolean {

    const now = performance.now();

    if (laser.points.length === 0) {
        return true;
    }

    const visiblePoints = laser.points.filter(
        ({ createdAt }) =>
            now - createdAt < POINT_LIFETIME
    );

    if (visiblePoints.length === 0) {
        return false;
    }

    if (visiblePoints.length < 2) {
        return true;
    }

    const first = visiblePoints[0].point;

    const drawPath = () => {
        context.beginPath();

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
    };

    context.save();

    context.lineCap = "round";
    context.lineJoin = "round";

    // Outer glow
    drawPath();

    context.strokeStyle = laser.stroke;
    context.lineWidth = laser.strokeWidth * 3;
    context.globalAlpha = 0.25;
    context.shadowColor = laser.stroke;
    context.shadowBlur = 15;

    context.stroke();

    // Inner glow
    drawPath();

    context.strokeStyle = laser.stroke;
    context.lineWidth = laser.strokeWidth * 1.8;
    context.globalAlpha = 0.7;
    context.shadowColor = laser.stroke;
    context.shadowBlur = 8;

    context.stroke();

    // Sharp laser core
    drawPath();

    context.strokeStyle = "#ffffff";
    context.lineWidth = laser.strokeWidth * 0.65;
    context.globalAlpha = 0.9;
    context.shadowBlur = 0;

    context.stroke();

    context.restore();

    return true;
}