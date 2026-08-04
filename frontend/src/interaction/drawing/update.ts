import type { Point } from "../../types/Types"
import { updatePreviewObject } from "../../objects/updatePreviewObject"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
  world: Point
  context: CanvasInteractionContext
}
// Handles the mouse move event when drawing a object
export function handleDrawingMouseMove({
  world,
  context,
}: Args): boolean {
  const { interactionRef, presence, requestRender } = context;
  if (interactionRef.current.type !== "drawing") {
    return false
  }

  const interaction = interactionRef.current
  // Update the preview object based on the current mouse position
  updatePreviewObject(
    interaction.preview,
    interaction.start,
    world,
  )
  // Send the updated preview object to other clients
  presence.send({
    type: "objectPreview",
    previewType: "create",
    boardObject: interaction.preview,
  });

  requestRender()

  return true
}