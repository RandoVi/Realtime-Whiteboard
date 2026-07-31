import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import { resizeObject } from "../objects/resizeObject"
import type { Point } from "../types/Types"
import type { Object } from "../types/Object"
import type { Editor } from "../editor/Editor"
import type { Presence } from "../socket/preview/Presence"

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
            world
        )

        // Update the object's size and position in the editor
        editor.execute(
            {
                type: "updateBoardObject",
                boardObjectId: boardObject.id,
                updates: {
                    x: resizedObject.x,
                    y: resizedObject.y,
                    width: resizedObject.width,
                    height: resizedObject.height,
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
                x: resizedObject.x,
                y: resizedObject.y,
                width: resizedObject.width,
                height: resizedObject.height,
            },
        });
    }

    return true
}