import type { Point } from "../types/Types"
import { updateDrawing } from "./drawing/updateDrawing"
import { updateMoving } from "./moving/updateMove"
import { updatePan } from "./panning/updatePan"
import { handleResizeMouseMove } from "./resizing/updateResize"
import type { CanvasInteractionContext } from "./CanvasInteractionContext"
import { updateLaser } from "./laser/updateLaser"

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

    context.presence.sendCursor(world);

    const interaction = context.interactionRef.current;

    switch (interaction.type) {

        case "resizing":
            handleResizeMouseMove({
                world,
                context,
            });
            break;


        case "drawing":
            updateDrawing({
                world,
                context,
            });
            break;

        case "laser":
            updateLaser({
                world,
                context,
            });
            break;


        case "moving":
            updateMoving({
                world,
                context,
            });
            break;


        case "panning":
            updatePan({
                pointer,
                context,
            });
            break;


        case "idle":
            break;
    }
}