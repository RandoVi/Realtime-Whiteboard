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