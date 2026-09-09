import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { getObjectsInSelection } from "./getObjectsInSelection";

export function finishSelection({
    context,
}: {
    context: CanvasInteractionContext;
}) {
    const interaction = context.interactionRef.current;

    if (interaction.type !== "selecting") {
        return;
    }

    const dx = interaction.current.x - interaction.start.x;
    const dy = interaction.current.y - interaction.start.y;

    const selectionSize = Math.sqrt(
        dx * dx + dy * dy
    );

    // A click on empty space is not a selection rectangle.
    if (selectionSize < 2) {
        context.selectedObjectIdsRef.current = [];
        context.setSelectedObjectIds([]);

        context.selectedObjectIdRef.current = null;
        context.setSelectedObjectId(null);

        context.presence.send({
            type: "selection",
            objectIds: [],
        });

        context.interactionRef.current = {
            type: "idle",
        };

        context.requestRender();
        return;
    }

    const selectedObjects = getObjectsInSelection(
        context.document.objectsRef.current,
        interaction.start,
        interaction.current,
    );

    const selectedIds = selectedObjects.map(
        object => object.id
    );

    context.selectedObjectIdsRef.current = selectedIds;
    context.setSelectedObjectIds(selectedIds);

    const primaryId = selectedIds[0] ?? null;

    context.selectedObjectIdRef.current = primaryId;
    context.setSelectedObjectId(primaryId);

    context.presence.send({
        type: "selection",
        objectIds: selectedIds,
    });

    context.interactionRef.current = {
        type: "idle",
    };

    context.requestRender();
}