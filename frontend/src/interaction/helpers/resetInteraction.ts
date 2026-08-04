import type { MutableRefObject } from "react";
import type { Interaction } from "../Interaction";

export function resetInteraction(
    interactionRef: MutableRefObject<Interaction>
) {
    interactionRef.current = {
        type: "idle"
    };
}