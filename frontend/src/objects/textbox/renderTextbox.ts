import type { Camera } from "../../types/Types"
import type { Textbox } from "./Textbox"

export function renderTextbox(
    context: CanvasRenderingContext2D,
    textbox: Textbox,
    camera: Camera
) {

    const screenX =
        textbox.x * camera.scale + camera.offsetX

    const screenY =
        textbox.y * camera.scale + camera.offsetY

    const screenWidth =
        textbox.width * camera.scale

    const screenHeight =
        textbox.height * camera.scale

    const fontSize =
        textbox.fontSize * camera.scale

    context.fillStyle = textbox.fill

    context.font =
        `${textbox.fontWeight} ${fontSize}px ${textbox.fontFamily}`

    context.textBaseline = "top"

    const lines = wrapText(
        context,
        textbox.text,
        screenWidth
    )

    const lineHeight = fontSize * 1.2

    for (let i = 0; i < lines.length; i++) {

        const y =
            screenY + i * lineHeight

        // Don't render outside the textbox.
        if (y + lineHeight > screenY + screenHeight) {
            break
        }

        context.fillText(
            lines[i],
            screenX,
            y
        )
    }
}

function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
): string[] {

    const result: string[] = []

    const paragraphs = text.split("\n")

    for (const paragraph of paragraphs) {

        const words = paragraph.split(" ")

        let line = ""

        for (const word of words) {

            const testLine =
                line.length === 0
                    ? word
                    : `${line} ${word}`

            const width =
                context.measureText(testLine).width

            if (
                width > maxWidth &&
                line.length > 0
            ) {
                result.push(line)
                line = word
            } else {
                line = testLine
            }
        }

        result.push(line)
    }

    return result
}