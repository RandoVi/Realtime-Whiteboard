import type { CanvasText } from "@common/shapes/CanvasText";
import type { Camera } from "../../camera/Camera";
import { measureText } from "./measureText";

export function renderText(
    context: CanvasRenderingContext2D,
    text: CanvasText,
    camera: Camera,
) {
    const screenX =
        text.x * camera.scale +
        camera.offsetX;

    const screenY =
        text.y * camera.scale +
        camera.offsetY;

    /*
     * Measure the text in world-space units.
     *
     * measureText() temporarily sets the canvas font
     * to the object's actual font size.
     */
    const measurement =
        measureText(
            context,
            text,
        );

    const lines =
        measurement.lines;

    const screenLineHeight =
        measurement.lineHeight *
        camera.scale;

    const screenFontSize =
        text.fontSize *
        camera.scale;

    context.save();

    /*
     * IMPORTANT:
     *
     * measureText() changes context.font, so the
     * screen-space font must be set AFTER measurement.
     */
    context.font =
        `${text.fontWeight} ${screenFontSize}px ${text.fontFamily}`;

    context.fillStyle =
        text.fill;

    context.textAlign =
        "left";

    context.textBaseline =
        "top";

    for (let i = 0; i < lines.length; i++) {

        context.fillText(
            lines[i],
            screenX,
            screenY + i * screenLineHeight,
        );
    }

    context.restore();
}