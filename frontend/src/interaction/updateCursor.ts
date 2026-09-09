import type { CanvasInteractionContext } from "./CanvasInteractionContext";

export function updateCursor(
    context: CanvasInteractionContext
) {
    const canvas = context.canvas;

    if (!canvas) {
        return;
    }

    const interaction = context.interactionRef.current;
    // console.log("Updating cursor for interaction type:", interaction.type);
    switch (interaction.type) {
        case "panning":
            canvas.style.cursor = "grabbing";
            break;

        case "drawing":
        case "laser":
            canvas.style.cursor = "crosshair";
            break;

        case "moving":
            canvas.style.cursor = "move";
            break;

        case "resizing":
            canvas.style.cursor = "grabbing"; 
            break;

        case "idle":
            canvas.style.cursor = "default";
            break;
    }
    // console.log("Cursor updated to:", canvas.style.cursor);
}