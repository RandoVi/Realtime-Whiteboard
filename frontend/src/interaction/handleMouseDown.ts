import type { Point } from "@common/types";
import type { Tool } from "../types/Tool";
import type { CanvasInteractionContext } from "./CanvasInteractionContext";

import { handleSelectMouseDown } from "./handleSelectMouseDown";
import { beginPan } from "./panning/beginPan";
import { beginDrawing } from "./drawing/beginDrawing";
import { beginLaser } from "./laser/beginLaser";


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
            handleSelectMouseDown({
                pointer,
                world,
                context,
            });
            break;


        case "pan":
            beginPan({
                pointer,
                context,
                canvas,
            });
            break;

        case "laser":
            beginLaser({
                world,
                context,
            });
            break;


        default:
            beginDrawing({
                tool,
                world,
                context,
            });
            break;
    }
}