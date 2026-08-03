//resize update.ts
import type { MutableRefObject } from "react"
import type { Interaction } from "../Interaction"
import { resizeObject } from "../../objects/resizeObject"
import type { Point } from "../../types/Types"
import type { Editor } from "../../editor/Editor"
import type { Presence } from "../../socket/preview/Presence"
import { getObjectResizeUpdates } from "../helpers/getObjectResizeUpdates"
import type { Document } from "../../document/Document"
import { getObjectById } from "../../objects/getObjectById"
import { updateObjectWithPreview } from "../helpers/updateObjectWithPreview"

type Args = {
    world: Point
    interactionRef: MutableRefObject<Interaction>
    document: Document
    editor: Editor
    presence: Presence
}

export function handleResizeMouseMove({
    world,
    interactionRef,
    document,
    editor,
    presence,
}: Args): boolean {

    if (
        interactionRef.current.type !== "resizing"
    ) {
        return false
    }

    const interaction = interactionRef.current
    const resizePoint = {
        x: world.x - interaction.offset.x,
        y: world.y - interaction.offset.y,
    }
    const boardObject = getObjectById(
        document.objectsRef.current,
        interaction.objectId
    );
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
        updateObjectWithPreview({
            editor,
            presence,
            objectId: boardObject.id,
            updates: getObjectResizeUpdates(resizedObject),
        });
    }

    return true
}