import type { Point } from "../types/Types"
import { handleDrawingMouseMove } from "./drawing/update"
import { handleMovingObjectMouseMove } from "./moving/update"
import { handlePanMouseMove } from "./panning/updatePan"
import { handleResizeMouseMove } from "./resizing/updateResize"
import type { CanvasInteractionContext } from "./CanvasInteractionContext"

type Args = {
    world: Point;
    pointer: Point;
    context: CanvasInteractionContext;
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
                context,
            });
            break;


        case "drawing":
            handleDrawingMouseMove({
                world,
                context,
            });
            break;


        case "moving":
            handleMovingObjectMouseMove({
                world,
                context,
            });
            break;


        case "panning":
            handlePanMouseMove({
                pointer,
                context,
            });
            break;


        case "idle":
            break;
    }
}