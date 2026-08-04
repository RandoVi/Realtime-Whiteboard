import type { Point } from "../types/Types";
import type { Tool } from "../types/Tool";
import type { CanvasInteractionContext } from "./CanvasInteractionContext";

import { handleSelectionMouseDown } from "./handleSelectionMouseDown";
import { handlePanMouseDown } from "./panning/beginPan";
import { handleDrawingMouseDown } from "./drawing/begin";


type Args = {
    pointer: Point;
    world: Point;
    tool: Tool;
    canvas: HTMLCanvasElement;
    context: CanvasInteractionContext;
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