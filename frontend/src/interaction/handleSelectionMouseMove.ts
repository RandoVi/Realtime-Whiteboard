import type { Camera, Point } from "../types/Types"
import type { Object } from "../types/Object"
import { getSelectionCursor } from "../selection/getSelectionCursor"
import { getSelectionHandle } from "../selection/getSelectionHandle"

type Args = {
  object: Object | undefined
  pointer: Point
  camera: Camera
  canvas: HTMLCanvasElement
}
// Handles the mouse move event when an object is selected, updating the cursor based on the selection handle
export function handleSelectionMouseMove({
  object,
  pointer,
  camera,
  canvas,
}: Args) {
  const handle = getSelectionHandle(
    object,
    pointer,
    camera,
  )

  canvas.style.cursor =
    getSelectionCursor(handle)
}