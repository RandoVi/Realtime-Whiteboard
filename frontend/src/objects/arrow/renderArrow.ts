import type { Camera } from "../../camera/Camera";
import type { Arrow } from "@common/shapes";

export function renderArrow(
    context: CanvasRenderingContext2D,
    arrow: Arrow,
    camera: Camera,
) {
    let { x, y, width, height } = arrow;

    if (width < 0) {
        x += width;
        width = Math.abs(width);
    }

    if (height < 0) {
        y += height;
        height = Math.abs(height);
    }

    const strokePadding = arrow.strokeWidth / 2;

    const innerX = x + strokePadding;
    const innerY = y + strokePadding;

    const innerWidth = Math.max(
        0,
        width - arrow.strokeWidth,
    );

    const innerHeight = Math.max(
        0,
        height - arrow.strokeWidth,
    );

    const left =
        innerX * camera.scale + camera.offsetX;

    const top =
        innerY * camera.scale + camera.offsetY;

    const screenWidth =
        innerWidth * camera.scale;

    const screenHeight =
        innerHeight * camera.scale;

    const centerX =
        left + screenWidth / 2;

    const centerY =
        top + screenHeight / 2;

    const headWidth =
        screenWidth * 0.35;

    const shaftHeight =
        screenHeight * 0.35;

    context.save();

    context.translate(centerX, centerY);
    context.rotate(arrow.rotation);

    const localLeft =
        -screenWidth / 2;

    const localTop =
        -screenHeight / 2;

    context.fillStyle = arrow.fill;
    context.strokeStyle = arrow.stroke;
    context.lineWidth = arrow.strokeWidth * camera.scale;
    context.lineJoin = "miter";

    context.beginPath();

    context.moveTo(
        localLeft,
        0,
    );

    context.lineTo(
        localLeft + headWidth,
        localTop,
    );

    context.lineTo(
        localLeft + headWidth,
        -shaftHeight / 2,
    );

    context.lineTo(
        localLeft + screenWidth,
        -shaftHeight / 2,
    );

    context.lineTo(
        localLeft + screenWidth,
        shaftHeight / 2,
    );

    context.lineTo(
        localLeft + headWidth,
        shaftHeight / 2,
    );

    context.lineTo(
        localLeft + headWidth,
        localTop + screenHeight,
    );

    context.lineTo(
        localLeft,
        0,
    );

    context.closePath();

    context.fill();
    context.stroke();

    context.restore();
}