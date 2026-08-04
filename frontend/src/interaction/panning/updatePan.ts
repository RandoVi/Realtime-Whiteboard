
import type { Point } from "../../types/Types"

import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
  pointer: Point
  context: CanvasInteractionContext
}
// Handle the mouse move event when panning the canvas
export function handlePanMouseMove({
  pointer,
  context,
}: Args): boolean {

  const { interactionRef, cameraRef, requestRender } = context

  if (interactionRef.current.type !== "panning") {
    return false
  }

  const interaction = interactionRef.current

  const dx = pointer.x - interaction.start.x
  const dy = pointer.y - interaction.start.y

  interactionRef.current = {
    ...interaction,
    start: pointer,
  }

  const camera = cameraRef.current

  cameraRef.current = {
    ...camera,
    offsetX: camera.offsetX + dx,
    offsetY: camera.offsetY + dy,
  }

  requestRender()

  return true
}