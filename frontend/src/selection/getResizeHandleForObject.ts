import type { Object } from "../types/Object"
import type { Camera } from "../types/Types"
import type { ResizeHandle } from "../types/selection"
import { getResizeHandleAtPoint } from "./getResizeHandleAtPoint"

export function getResizeHandleForObject(
  object: Object,
  point: { x: number, y: number },
  camera: Camera
): ResizeHandle | null {

  if (
    object.type !== "rectangle" &&
    object.type !== "circle"
  ) {
    return null
  }

  return getResizeHandleAtPoint(
    object,
    point,
    camera
  )
}