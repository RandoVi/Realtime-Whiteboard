import type { Circle } from "./Circle"
import type { Camera, Point } from "../../types/Types"
import type { ResizeHandle } from "../../types/selection"
import { hitTestResizeHandles } from "../../selection/hitTestResizeHandles"
import { getCircleBounds } from "./getCircleBounds"

export function getResizeHandleCircle(
  object: Circle,
  point: Point,
  camera: Camera
): ResizeHandle | null {

  return hitTestResizeHandles(
    getCircleBounds(object),
    point,
    camera
  )
}