import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import { resizeShape } from "../shapes/resizeShape"
import type { Point } from "../types/Types"
import type { Shape } from "../types/Shape"
import type { Editor } from "../editor/Editor"
import type { Presence } from "../socket/preview/Presence"

type Args = {
    world: Point
    interactionRef: MutableRefObject<Interaction>
    getSelectedShape: () => Shape | undefined
    editor: Editor
    presence: Presence
}

export function handleResizeMouseMove({
    world,
    interactionRef,
    getSelectedShape,
    editor,
    presence,
}: Args): boolean {

    if (
        interactionRef.current.type !== "resizingShape"
    ) {
        return false
    }

    const interaction = interactionRef.current

    const boardObject = getSelectedShape()
    // If there is a selected shape, resize it based on the mouse movement
    if (boardObject) {

        const resizedShape = {
            ...interaction.original,
        }


        resizeShape(
            resizedShape,
            interaction.original,
            interaction.handle,
            world
        )

        // Update the shape's size and position in the editor
        editor.execute(
            {
                type: "updateBoardObject",
                boardObjectId: boardObject.id,
                updates: {
                    x: resizedShape.x,
                    y: resizedShape.y,
                    width: resizedShape.width,
                    height: resizedShape.height,
                },
            },
            {
                broadcast: false,
            }
        );
        // Send the updated size and position to other clients for preview
        presence.send({
            type: "objectPreview",
            previewType: "update",
            boardObjectId: boardObject.id,
            updates: {
                x: resizedShape.x,
                y: resizedShape.y,
                width: resizedShape.width,
                height: resizedShape.height,
            },
        });
    }

    return true
}