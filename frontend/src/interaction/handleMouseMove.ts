import type { Point } from "../types/Types"
import { handleDrawingMouseMove } from "./drawing/update"
import { handleMovingObjectMouseMove } from "./moving/update"
import { handlePanMouseMove } from "./panning/handlePanMouseMove"
import { handleResizeMouseMove } from "./resizing/update"
import type { InteractionContext } from "./InteractionContext"

type Args = {
    world: Point;
    pointer: Point;
    context: InteractionContext;
}

export function handleMouseMove({
    world,
    pointer,
    context,
}: Args) {

    const interaction = context.interactionRef.current;

    switch (interaction.type) {

        case "resizing":
            handleResizeMouseMove({
                world,
                interactionRef: context.interactionRef,
                document: context.document,
                editor: context.editor,
                presence: context.presence,
            });
            break;


        case "drawing":
            handleDrawingMouseMove({
                world,
                interactionRef: context.interactionRef,
                requestRender: context.requestRender,
                presence: context.presence,
            });
            break;


        case "moving":
            handleMovingObjectMouseMove({
                world,
                interactionRef: context.interactionRef,
                document: context.document,
                editor: context.editor,
                presence: context.presence,
            });
            break;


        case "panning":
            handlePanMouseMove({
                pointer,
                cameraRef: context.cameraRef,
                interactionRef: context.interactionRef,
                requestRender: context.requestRender,
            });
            break;


        case "idle":
            break;
    }
}