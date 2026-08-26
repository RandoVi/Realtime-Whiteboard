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