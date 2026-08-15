import type { CanvasInteractionContext } from "../CanvasInteractionContext"

export function finishRotation({
    context,
}: {
    context: CanvasInteractionContext
}): boolean {

    const {
        interactionRef,
        editor,
    } = context

    const interaction = interactionRef.current

    if (
        interaction.type !== "rotating"
    ) {
        return false
    }

    if (!("rotation" in interaction.preview)) {
        interactionRef.current = {
            type: "idle",
        }

        return false
    }

    editor.execute({
        type: "updateBoardObject",
        boardObjectId: interaction.objectId,
        updates: {
            rotation: interaction.preview.rotation,
        },
    })

    interactionRef.current = {
        type: "idle",
    }

    return true
}