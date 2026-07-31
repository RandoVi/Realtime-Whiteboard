import type { MutableRefObject } from "react"
import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"

import { updatePreviewShape } from "../shapes/updatePreviewShape"
import type { Presence } from "../socket/preview/Presence"

type Args = {
  world: Point
  interactionRef: MutableRefObject<Interaction>
  requestRender: () => void
  presence: Presence
}
// Handles the mouse move event when drawing a shape
export function handleDrawingMouseMove({
  world,
  interactionRef,
  requestRender,
  presence,
}: Args): boolean {
  if (interactionRef.current.type !== "drawingShape") {
    return false
  }

  const interaction = interactionRef.current
  // Update the preview shape based on the current mouse position
  updatePreviewShape(
    interaction.preview,
    interaction.start,
    world,
  )
  // Send the updated preview shape to other clients
  presence.send({
    type: "objectPreview",
    previewType: "create",
    boardObject: interaction.preview,
  });

  requestRender()

  return true
}