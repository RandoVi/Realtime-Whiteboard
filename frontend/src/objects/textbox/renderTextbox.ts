import type { Textbox } from "@common/shapes/Textbox";
import type { Camera } from "../../camera/Camera";
import { TEXT_LINE_HEIGHT } from "../text/textConstants";

export function renderTextbox(
    context: CanvasRenderingContext2D,
    textbox: Textbox,
    camera: Camera,
) {
    const screenX =
        textbox.x * camera.scale + camera.offsetX;

    const screenY =
        textbox.y * camera.scale + camera.offsetY;

    const screenWidth =
        textbox.width * camera.scale;

    const screenHeight =
        textbox.height * camera.scale;

    const centerX =
        screenX + screenWidth / 2;

    const centerY =
        screenY + screenHeight / 2;

    const radius =
        8 * camera.scale;

    const padding =
        14 * camera.scale;

    const topStripHeight =
        36 * camera.scale;

    context.save();

    context.translate(centerX, centerY);
    context.rotate(textbox.rotation);

    // From this point on, coordinates are relative
    // to the textbox center.
    const localX = -screenWidth / 2;
    const localY = -screenHeight / 2;

    /*
     * ------------------------------------------------
     * Sticky note shadow
     * Light source is assumed to be above the note.
     * ------------------------------------------------
     */

    context.shadowColor = "rgba(0, 0, 0, 0.18)";
    context.shadowBlur = 12 * camera.scale;
    context.shadowOffsetX = 2 * camera.scale;
    context.shadowOffsetY = 6 * camera.scale;

    context.fillStyle = textbox.background;

    drawStickyNotePath(
        context,
        localX,
        localY,
        screenWidth,
        screenHeight,
        radius,
    );

    context.fill();

    /*
     * ------------------------------------------------
     * Main paper
     * ------------------------------------------------
     */

    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.fillStyle = textbox.background;

    drawStickyNotePath(
        context,
        localX,
        localY,
        screenWidth,
        screenHeight,
        radius,
    );

    context.fill();

    /*
     * ------------------------------------------------
     * Darker top adhesive area
     * ------------------------------------------------
     */

    context.save();

    context.beginPath();

    context.roundRect(
        localX,
        localY,
        screenWidth,
        topStripHeight + radius,
        radius,
    );

    context.clip();

    context.fillStyle = darkenColor(
        textbox.background,
        0.03,
    );

    context.fillRect(
        localX,
        localY,
        screenWidth,
        topStripHeight,
    );

    context.restore();

    /*
     * ------------------------------------------------
     * Text
     * ------------------------------------------------
     */

    const fontSize =
        textbox.fontSize * camera.scale;

    context.fillStyle =
        textbox.fill;
    
    context.font =
        `${textbox.fontWeight} ${fontSize}px ${textbox.fontFamily}`;

    context.textAlign = "center";
    context.textBaseline = "middle";

    const lines = wrapText(
        context,
        textbox.text,
        screenWidth - padding * 2,
    );

    const lineHeight =
        fontSize * TEXT_LINE_HEIGHT;

    /*
     * Text is centered inside the area below
     * the darker adhesive strip.
     */

    const textAreaTop =
        localY + topStripHeight;

    const textAreaHeight =
        screenHeight - topStripHeight;

    const totalTextHeight =
        lines.length * lineHeight;

    const startY =
        textAreaTop +
        textAreaHeight / 2 -
        totalTextHeight / 2 +
        lineHeight / 2;

    /*
     * Clip text to the sticky note.
     */

    context.save();

    drawStickyNotePath(
        context,
        localX,
        localY,
        screenWidth,
        screenHeight,
        radius,
    );

    context.clip();

    for (let i = 0; i < lines.length; i++) {

        const y =
            startY + i * lineHeight;

        context.fillText(
            lines[i],
            localX + screenWidth / 2,
            y,
        );
    }

    context.restore();

    context.restore();
}


/*
 * ----------------------------------------------------
 * Sticky note shape
 * ----------------------------------------------------
 *
 * The bottom edge is intentionally slightly curved
 * to make the paper feel less perfectly rectangular.
 */

function drawStickyNotePath(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) {
    const bottom =
        y + height;

    const curl =
        Math.min(
            4 * Math.max(1, width / 200),
            height * 0.03,
        );

    context.beginPath();

    /*
     * Top-left
     */

    context.moveTo(
        x + radius,
        y,
    );

    /*
     * Top edge
     */

    context.lineTo(
        x + width - radius,
        y,
    );

    /*
     * Top-right corner
     */

    context.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius,
    );

    /*
     * Right edge
     */

    context.lineTo(
        x + width,
        bottom - radius,
    );

    /*
     * Bottom-right corner
     */

    context.quadraticCurveTo(
        x + width,
        bottom,
        x + width - radius,
        bottom,
    );

    /*
     * Slight upward/downward paper bend.
     */

    context.quadraticCurveTo(
        x + width * 0.65,
        bottom + curl,
        x + width * 0.35,
        bottom + curl * 0.5,
    );

    context.quadraticCurveTo(
        x + width * 0.15,
        bottom,
        x + radius,
        bottom,
    );

    /*
     * Bottom-left corner
     */

    context.quadraticCurveTo(
        x,
        bottom,
        x,
        bottom - radius,
    );

    /*
     * Left edge
     */

    context.lineTo(
        x,
        y + radius,
    );

    /*
     * Top-left corner
     */

    context.quadraticCurveTo(
        x,
        y,
        x + radius,
        y,
    );

    context.closePath();
}


/*
 * ----------------------------------------------------
 * Darken a hex color by a percentage.
 * ----------------------------------------------------
 */

function darkenColor(
    hex: string,
    amount: number,
): string {

    const value =
        hex.replace("#", "");

    if (value.length !== 6) {
        return hex;
    }

    const r =
        parseInt(
            value.substring(0, 2),
            16,
        );

    const g =
        parseInt(
            value.substring(2, 4),
            16,
        );

    const b =
        parseInt(
            value.substring(4, 6),
            16,
        );

    return `rgb(
        ${Math.max(0, Math.round(r * (1 - amount)))},
        ${Math.max(0, Math.round(g * (1 - amount)))},
        ${Math.max(0, Math.round(b * (1 - amount)))}
    )`;
}


/*
 * ----------------------------------------------------
 * Word wrapping
 * ----------------------------------------------------
 */

function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
): string[] {

    const result: string[] = [];

    const paragraphs =
        text.split("\n");

    for (const paragraph of paragraphs) {

        const words =
            paragraph.split(" ");

        let line = "";

        for (const word of words) {

            const testLine =
                line.length === 0
                    ? word
                    : `${line} ${word}`;

            const width =
                context.measureText(testLine).width;

            /*
             * Break long words naturally instead of
             * allowing them to escape the textbox.
             */

            if (
                width > maxWidth &&
                line.length > 0
            ) {
                result.push(line);
                line = word;
            } else {
                line = testLine;
            }
        }

        result.push(line);
    }

    return result;
}