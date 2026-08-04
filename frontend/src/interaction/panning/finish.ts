import type { MutableRefObject } from "react";
import type { Interaction } from "../Interaction";

type Args = {
    interactionRef: MutableRefObject<Interaction>;
};

export function handlePanMouseUp({
    interactionRef,
}: Args): boolean {

    if (interactionRef.current.type !== "panning") {
        return false;
    }

    interactionRef.current = {
        type: "idle",
    };

    return true;
}