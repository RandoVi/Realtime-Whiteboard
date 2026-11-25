import type { CanvasText } from "@common/shapes/CanvasText";
import type { Camera } from "../../camera/Camera";
import { TEXT_LINE_HEIGHT } from "./textConstants";
import { wrapText } from "./wrapText";

export function renderText(
    context: CanvasRenderingContext2D,
    text: CanvasText,
    camera: Camera,
) {
    const width = text.width * camera.scale;
    const height = text.height * camera.scale;
    const centerX =
        (text.x + text.width / 2) * camera.scale + camera.offsetX;
    const centerY =
        (text.y + text.height / 2) * camera.scale + camera.offsetY;

    const fontSize = text.fontSize * camera.scale;
    const padding = 12 * camera.scale;
    const lineHeight = fontSize * TEXT_LINE_HEIGHT;

    context.save();
    context.translate(centerX, centerY);
    context.rotate(text.rotation);

    context.beginPath();
    context.rect(-width / 2, -height / 2, width, height);
    context.clip();

    context.font =
        `${text.fontWeight} ${fontSize}px ${text.fontFamily}`;
    context.fillStyle = text.fill;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const lines = wrapText(
        context,
        text.text,
        Math.max(1, width - padding * 2),
    );

    const firstLineY =
        -(lines.length * lineHeight) / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
        context.fillText(
            line,
            0,
            firstLineY + index * lineHeight,
        );
    });

    context.restore();
}