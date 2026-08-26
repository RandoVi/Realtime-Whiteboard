import type { Point } from "@common/types";
import { updateDrawing } from "../drawing/updateDrawing"
import { updateMoving } from "../moving/updateMoving"
import { updatePan } from "../panning/updatePan"
import { updateResize } from "../resizing/updateResize"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { updateLaser } from "../laser/updateLaser"
import { updateRotation } from "../rotation/updateRotation";
import { updateSelection } from "../selection/updateSelection";

type Args = {
    world: Point;
    pointer: Point;
    context: CanvasInteractionContext;
    constrain: boolean
}

export function handleMouseMove({
    world,
    pointer,
    context,
    constrain,
}: Args) {

    context.presence.sendCursor(world);

    const interaction = context.interactionRef.current;

    switch (interaction.type) {

        case "selecting":
            updateSelection({
                world,
                context,
            });
            break;

        case "resizing":
            updateResize({
                world,
                context,
                constrain,
            });
            break;

        case "rotating":
            updateRotation({
                world,
                context,
            })
            break


        case "drawing":
            updateDrawing({
                world,
                context,
                constrain,
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