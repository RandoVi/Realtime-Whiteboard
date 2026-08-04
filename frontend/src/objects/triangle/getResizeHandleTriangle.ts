import type { Triangle } from "./Triangle"
import type { Camera, Point } from "../../types/Types"
import type { ResizeHandle } from "../../types/selection"
import { hitTestResizeHandles  } from "../../selection/hitTestResizeHandles"
import { getTriangleBounds } from "./getTriangleBounds"

export function getResizeHandleTriangle(
  object: Triangle,
  point: Point,
  camera: Camera
): ResizeHandle | null {

  return hitTestResizeHandles (
    getTriangleBounds(object),
    point,
    camera
  )
}