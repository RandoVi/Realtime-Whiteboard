import type { MutableRefObject } from "react";
import type { Interaction } from "./Interaction";
import type { Shape } from "../types/Shape";
import type { Editor } from "../editor/Editor";

type Args = {
    interactionRef: MutableRefObject<Interaction>;
    getSelectedShape: () => Shape | undefined;
    editor: Editor;
};
// Handles the mouse up event for a shape that is being moved
export function handleMovingShapeMouseUp({
    interactionRef,
    getSelectedShape,
    editor,
}: Args): boolean {



    if (interactionRef.current.type !== "movingShape") {
        return false;
    }

    const interaction = interactionRef.current;
    // If the shape was not moved, we can just set the interaction to idle and return true
    if (!interaction.moved) {
        interactionRef.current = {
            type: "idle",
        };

        return true;
    }

    const shape = getSelectedShape();

    if (!shape) {
        return false;
    }
    // Update the shape's position in the editor
    editor.execute({
        type: "updateShape",
        shapeId: shape.id,
        updates: {
            x: shape.x,
            y: shape.y,
        },
    });

    interactionRef.current = {
        type: "idle",
    };

    return true;
}