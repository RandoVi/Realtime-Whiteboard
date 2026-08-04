import type { MutableRefObject } from "react"
import type { Camera, Point } from "../../types/Types"
import type { Interaction } from "../Interaction"

type Args = {
  pointer: Point
  cameraRef: MutableRefObject<Camera>
  interactionRef: MutableRefObject<Interaction>
  requestRender: () => void
}
// Handle the mouse move event when panning the canvas
export function handlePanMouseMove({
  pointer,
  cameraRef,
  interactionRef,
  requestRender,
}: Args): boolean {
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