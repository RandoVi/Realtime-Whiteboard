import type { Camera } from "../../types/Types"
import type { Textbox } from "./Textbox"

export function renderTextbox(
    context: CanvasRenderingContext2D,
    textbox: Textbox,
    camera: Camera,
) {

    context.save()

    const screenX =
        textbox.x * camera.scale + camera.offsetX

    const screenY =
        textbox.y * camera.scale + camera.offsetY

    const screenWidth =
        textbox.width * camera.scale

    const screenHeight =
        textbox.height * camera.scale

    const radius = 6 * camera.scale
    const padding = 12 * camera.scale

    // Background
    context.beginPath()

    context.fillStyle = textbox.background

    context.roundRect(
        screenX,
        screenY,
        screenWidth,
        screenHeight,
        radius
    )

    context.fill()

    // Text
    const fontSize =
        textbox.fontSize * camera.scale

    context.fillStyle = textbox.fill

    context.font =
        `${textbox.fontWeight} ${fontSize}px ${textbox.fontFamily}`

    context.textAlign = "center"
    context.textBaseline = "top"

    const textAreaWidth =
        screenWidth - padding * 2

    const textAreaHeight =
        screenHeight - padding * 2

    const lines = wrapText(
        context,
        textbox.text,
        textAreaWidth
    )

    const lineHeight = fontSize * 1.2

    const totalTextHeight =
        lines.length * lineHeight

    const startY =
        screenY +
        padding +
        (textAreaHeight - totalTextHeight) / 2

    const centerX =
        screenX + screenWidth / 2

    for (let i = 0; i < lines.length; i++) {

        const y =
            startY + i * lineHeight

        if (
            y + lineHeight >
            screenY + screenHeight - padding
        ) {
            break
        }

        context.fillText(
            lines[i],
            centerX,
            y
        )
    }

    context.restore()
}

function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
): string[] {

    const result: string[] = [];

    const paragraphs = text.split("\n");

    for (const paragraph of paragraphs) {

        const words = paragraph.split(" ");

        let line = "";

        for (const word of words) {

            // Handle very long words that don't fit
            // on a single line.
            if (
                context.measureText(word).width > maxWidth
            ) {

                if (line.length > 0) {
                    result.push(line);
                    line = "";
                }

                let currentWord = "";

                for (const character of word) {

                    const test =
                        currentWord + character;

                    if (
                        context.measureText(test).width >
                        maxWidth &&
                        currentWord.length > 0
                    ) {
                        result.push(currentWord);
                        currentWord = character;
                    } else {
                        currentWord = test;
                    }
                }

                if (currentWord.length > 0) {
                    line = currentWord;
                }

                continue;
            }

            const testLine =
                line.length === 0
                    ? word
                    : `${line} ${word}`;

            const width =
                context.measureText(testLine).width;

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