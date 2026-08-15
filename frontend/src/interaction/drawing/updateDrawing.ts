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
    return false
  }

  const interaction = interactionRef.current

  let current = world

  if (constrain) {
    current = getConstrainedPoint(
      interaction.start,
      world,
    )
  }

  // Update the preview object based on the current mouse position
  updatePreviewObject(
    interaction.preview,
    interaction.start,
    current,
  )
  // Send the updated preview object to other clients
  presence.send({
    type: "objectPreview",
    previewType: "create",
    boardObject: interaction.preview,
  })

  requestRender()

  return true
}

function getConstrainedPoint(
  start: Point,
  current: Point,
): Point {

  const dx = current.x - start.x
  const dy = current.y - start.y

  const size = Math.max(
    Math.abs(dx),
    Math.abs(dy),
  )

  return {
    x: start.x + Math.sign(dx) * size,
    y: start.y + Math.sign(dy) * size,
  }
}