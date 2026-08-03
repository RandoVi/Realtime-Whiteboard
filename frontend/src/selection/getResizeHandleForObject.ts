import type { Object } from "../types/Object"
import type { Camera, Point } from "../types/Types"
import type { ResizeHandle } from "../types/selection"
import { getObjectHandler } from "../objects/registry/getObjectHandler"


export function getResizeHandleForObject(
  object: Object,
  point: Point,
  camera: Camera
): ResizeHandle | null {

  return (
    getObjectHandler(object)
      .getResizeHandle?.(
        object,
        point,
        camera
      )
    ?? null
  )
}