import type { MutableRefObject } from "react";
import type { Interaction } from "../Interaction";
import type { Object } from "../../types/Object";
import type { Editor } from "../../editor/Editor";
import { getObjectMoveUpdates } from "../helpers/getObjectMoveUpdates";

type Args = {
    interactionRef: MutableRefObject<Interaction>;
    getSelectedObject: () => Object | undefined;
    editor: Editor;
};
// Handles the mouse up event for an object that is being moved
export function handleMovingObjectMouseUp({
    interactionRef,
    getSelectedObject,
    editor,
}: Args): boolean {



    if (interactionRef.current.type !== "moving") {
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

    const boardObject = getSelectedObject();

    if (!boardObject) {
        return false;
    }
    // Update the board object's position in the editor
    editor.execute({
        type: "updateBoardObject",
        boardObjectId: boardObject.id,
        updates: getObjectMoveUpdates(boardObject),
    });

    interactionRef.current = {
        type: "idle",
    };

    return true;
}