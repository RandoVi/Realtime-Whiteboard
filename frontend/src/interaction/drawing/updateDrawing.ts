import type { Point } from "@common/types";
import { updatePreviewObject } from "../../objects/updatePreviewObject"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
  world: Point
  context: CanvasInteractionContext
  constrain: boolean
}
// Handles the mouse move event when drawing a object
export function updateDrawing({
  world,
  context,
  constrain,
}: Args): boolean {
  const { interactionRef, presence, requestRender } = context;

  if (interactionRef.current.type !== "drawing") {
    return false;
  }

  const interaction = interactionRef.current;

  updatePreviewObject(
    interaction.preview,
    interaction.start,
    world,
    constrain,
  );

  presence.send({
    type: "objectPreview",
    previewType: "create",
    boardObject: interaction.preview,
  });

  requestRender();

  return true;
}