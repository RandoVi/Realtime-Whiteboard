import type { CanvasInteractionContext } from "../CanvasInteractionContext";


type Args = {
    context: CanvasInteractionContext;
};
// Handles the mouse up event for an object that is being moved
export function finishMoving({
    context
}: Args): boolean {

    const { interactionRef } = context;

    if (interactionRef.current.type !== "moving") {
        return false;
    }

    interactionRef.current = {
        type: "idle",
    };

    return true;
}