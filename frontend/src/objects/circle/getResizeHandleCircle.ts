import type { Circle } from "@common/shapes"
import type { Point } from "@common/types"
import type { Camera } from "../../types/Types"
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