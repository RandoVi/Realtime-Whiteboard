// import { getObjectById } from "../../objects/getObjectById";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { clearObjectPreview } from "../helpers/clearObjectPreview";
import { getObjectMoveUpdates } from "../helpers/getObjectMoveUpdates";


type Args = {
    context: CanvasInteractionContext;
};
// Handles the mouse up event for an object that is being moved
export function finishMoving({
    context
}: Args): boolean {

    const {
        interactionRef,
        editor,
        presence,
    } = context;

    const interaction = interactionRef.current;

    if (interaction.type !== "moving") {
        return false;
    }
    // console.log("FINISH ORIGINAL", interaction.original);
    // console.log("FINISH PREVIEW", interaction.preview);

    // const updates = getObjectMoveUpdates(interaction.preview);

    // console.log("FINISH UPDATES", updates);

    if (interaction.moved) {
        for (let i = 0; i < interaction.preview.length; i++) {
            editor.execute({
                type: "updateBoardObject",
                boardObjectId: interaction.objectIds[i],
                updates: getObjectMoveUpdates(
                    interaction.preview[i]
                ),
            });
        }

        clearObjectPreview({
            presence,
        });
    }


    interactionRef.current = {
        type: "idle",
    };


    return true;
}

