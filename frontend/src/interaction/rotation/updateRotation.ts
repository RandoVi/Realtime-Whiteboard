import type { Point } from "@common/types"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { getObjectById } from "../../objects/getObjectById"
import { sendObjectPreview } from "../helpers/sendObjectPreview"
import { getObjectCenter } from "../../objects/getObjectCenter"

type Args = {
    world: Point
    context: CanvasInteractionContext
}

export function updateRotation({
    world,
    context,
}: Args): boolean {

    const {
        interactionRef,
        presence,
        requestRender,
    } = context

    if (interactionRef.current.type !== "rotating") {
        return false
    }

    const interaction = interactionRef.current
    const object = interaction.preview

    const center = getObjectCenter(object)

    const angle = Math.atan2(
        world.y - center.y,
        world.x - center.x,
    )

    object.rotation = angle + Math.PI / 2

    const boardObject = getObjectById(
        context.document.objectsRef.current,
        interaction.objectId,
    )

    if (!boardObject) {
        return false
    }


    sendObjectPreview({
        presence,
        objects: [
            {
                objectId: boardObject.id,
                updates: {
                    rotation: object.rotation,
                },
            },
        ],
    });

    requestRender()

    return true
}