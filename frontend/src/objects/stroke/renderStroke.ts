import type { Camera } from "../../types/Types";
import type { Stroke } from "./Stroke";

export function renderStroke(
    context: CanvasRenderingContext2D,
    stroke: Stroke,
    camera: Camera,
) {
    if (stroke.points.length === 0) {
        return;
    }

    context.beginPath();

    context.strokeStyle = stroke.stroke;
    context.lineWidth = stroke.strokeWidth;
    context.lineCap = "round";
    context.lineJoin = "round";

    const first = stroke.points[0];

    context.moveTo(
        first.x * camera.scale + camera.offsetX,
        first.y * camera.scale + camera.offsetY,
    );

    for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];

        context.lineTo(
            point.x * camera.scale + camera.offsetX,
            point.y * camera.scale + camera.offsetY,
        );
    }

    context.stroke();
}