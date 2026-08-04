import type { CanvasInteractionContext } from "../CanvasInteractionContext";

type Args = {
    context: CanvasInteractionContext;
};

export function handlePanMouseUp({
    context
}: Args): boolean {
    const { interactionRef } = context;

    if (interactionRef.current.type !== "panning") {
        return false;
    }

    interactionRef.current = {
        type: "idle",
    };

    return true;
}