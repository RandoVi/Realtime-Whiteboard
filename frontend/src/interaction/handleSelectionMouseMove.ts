import type { Camera, Point } from "../types/Types"
import type { Shape } from "../types/Shape"
import { getSelectionCursor } from "../selection/getSelectionCursor"
import { getSelectionHandle } from "../selection/getSelectionHandle"

type Args = {
  shape: Shape | undefined
  pointer: Point
  camera: Camera
  canvas: HTMLCanvasElement
}
// Handles the mouse move event when a shape is selected, updating the cursor based on the selection handle
export function handleSelectionMouseMove({
  shape,
  pointer,
  camera,
  canvas,
}: Args) {
  const handle = getSelectionHandle(
    shape,
    pointer,
    camera,
  )

  canvas.style.cursor =
    getSelectionCursor(handle)
}