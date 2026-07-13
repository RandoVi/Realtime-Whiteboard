import type { Shape } from "../../shapes/Shape"
import type { Camera } from "../../Types"
import type { ResizeHandle } from "../../tools/selection"
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