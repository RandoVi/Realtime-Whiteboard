import type { Point } from "../types/Types";
import type { Tool } from "../types/Tool";
import type { InteractionContext } from "./InteractionContext";

import { handleSelectionMouseDown } from "./handleSelectionMouseDown";
import { handlePanMouseDown } from "./panning/handlePanMouseDown";
import { handleDrawingMouseDown } from "./drawing/begin";


type Args = {
    pointer: Point;
    world: Point;
    tool: Tool;
    canvas: HTMLCanvasElement;
    context: InteractionContext;
};


export function handleMouseDown({
    pointer,
    world,
    tool,
    canvas,
    context,
}: Args) {

    switch (tool) {

        case "select":
            handleSelectionMouseDown({
                pointer,
                world,
                context,
            });
            break;


        case "pan":
            handlePanMouseDown({
                pointer,
                context,
                canvas,
            });
            break;


        default:
            handleDrawingMouseDown({
                tool,
                world,
                context,
            });
            break;
    }
}