import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import { resizeObject } from "../objects/resizeObject"
import type { Point } from "../types/Types"
import type { Object } from "../types/Object"
import type { Editor } from "../editor/Editor"
import type { Presence } from "../socket/preview/Presence"
import { getObjectResizeUpdates } from "./helpers/getObjectResizeUpdates"

type Args = {
    world: Point
    interactionRef: MutableRefObject<Interaction>
    getSelectedObject: () => Object | undefined
    editor: Editor
    presence: Presence
}

export function handleResizeMouseMove({
    world,
    interactionRef,
    getSelectedObject,
    editor,
    presence,
}: Args): boolean {

    if (
        interactionRef.current.type !== "resizingObject"
    ) {
        return false
    }

    const interaction = interactionRef.current
    const resizePoint = {
        x: world.x - interaction.offset.x,
        y: world.y - interaction.offset.y,
    }
    const boardObject = getSelectedObject()
    // If there is a selected object, resize it based on the mouse movement
    if (boardObject) {

        const resizedObject = {
            ...interaction.original,
        }

        resizeObject(
            resizedObject,
            interaction.original,
            interaction.handle,
            resizePoint
        )

        // Update the object's size and position in the editor
        editor.execute(
            {
                type: "updateBoardObject",
                boardObjectId: boardObject.id,
                updates: getObjectResizeUpdates(resizedObject),
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
            updates: getObjectResizeUpdates(resizedObject),
        });
    }

    return true
}