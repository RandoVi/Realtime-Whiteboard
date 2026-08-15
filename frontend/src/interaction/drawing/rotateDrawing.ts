import type { CanvasInteractionContext } from "../CanvasInteractionContext"

const ROTATION_SPEED = Math.PI / 4

export function rotateDrawing(
    deltaY: number,
    context: CanvasInteractionContext,
): boolean {

    const interaction = context.interactionRef.current

    if (interaction.type !== "drawing") {
        return false
    }

    if (!("rotation" in interaction.preview)) {
        return false
    }

    const direction = Math.sign(deltaY)

    interaction.preview.rotation +=
        -direction * ROTATION_SPEED

    context.presence.send({
        type: "objectPreview",
        previewType: "create",
        boardObject: interaction.preview,
    })

    context.requestRender()

    return true
}