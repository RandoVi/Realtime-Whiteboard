import type { Shape } from "../types/Shape"
import type { Camera } from "../types/Types"
import type { ResizeHandle } from "../types/selection"
import { getResizeHandleAtPoint } from "./getResizeHandleAtPoint"

export function getResizeHandleForShape(
  shape: Shape,
  point: {x:number, y:number},
  camera: Camera
): ResizeHandle | null {

  if (shape.type !== "rectangle") {
    return null
  }

  return getResizeHandleAtPoint(
    shape,
    point,
    camera
  )
}