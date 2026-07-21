import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import { resizeShape } from "../shapes/resizeShape"
import type { Point } from "../types/Types"
import type { Shape } from "../types/Shape"
import type { Editor } from "../editor/Editor"

type Args = {
    world: Point
    interactionRef: MutableRefObject<Interaction>
    getSelectedShape: () => Shape | undefined
    editor: Editor
}

export function handleResizeMouseMove({
    world,
    interactionRef,
    getSelectedShape,
    editor,
}: Args): boolean {

    if (
        interactionRef.current.type !== "resizingShape"
    ) {
        return false
    }

    const interaction = interactionRef.current

    const shape = getSelectedShape()

    if (shape) {

        const resizedShape = {
            ...interaction.original,
        }


        resizeShape(
            resizedShape,
            interaction.original,
            interaction.handle,
            world
        )


        editor.execute(
            {
                type: "updateShape",
                shapeId: shape.id,
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
    }

    return true
}