import { normalizeObject } from "../../objects/normalizeObject";
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { getObjectResizeUpdates } from "../helpers/getObjectResizeUpdates";

type Args = {
  context: CanvasInteractionContext

}
// Handles the mouse up event for resizing a object
export function handleResizeMouseUp({
  context,
}: Args): boolean {

  const {
    interactionRef,
    editor,
  } = context;

  const interaction = interactionRef.current;

  if (interaction.type !== "resizing") {
    return false;
  }

  const normalized = normalizeObject(interaction.preview);

  editor.execute({
    type: "updateBoardObject",
    boardObjectId: interaction.objectId,
    updates: getObjectResizeUpdates(normalized),
  });

  interactionRef.current = {
    type: "idle",
  };

  return true;
}