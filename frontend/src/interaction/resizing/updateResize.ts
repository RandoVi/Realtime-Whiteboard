//resize update.ts
import { resizeObject } from "../../objects/resizeObject"
import type { Point } from "../../types/Types"
import { getObjectResizeUpdates } from "../helpers/getObjectResizeUpdates"
import { getObjectById } from "../../objects/getObjectById"
import { updateObjectWithPreview } from "../helpers/updateObjectWithPreview"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
    world: Point
    context: CanvasInteractionContext
}

export function handleResizeMouseMove({
    world,
    context,
}: Args): boolean {
    
    const { interactionRef, document, editor, presence } = context;
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