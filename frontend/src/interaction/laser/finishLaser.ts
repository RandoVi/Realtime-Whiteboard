import type { CanvasInteractionContext } from "../CanvasInteractionContext";

type Args = {
    context: CanvasInteractionContext;
};

export function finishLaser({
    context,
}: Args): boolean {

    if (context.interactionRef.current.type !== "laser") {
        return false;
    }

    context.interactionRef.current = {
        type: "idle",
    };

    context.requestRender();

    return true;
}