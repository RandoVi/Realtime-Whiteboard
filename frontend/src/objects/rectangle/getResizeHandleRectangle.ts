import type { Rectangle } from "@common/shapes"
import type { Point } from "@common/types"
import type { Camera } from "../../types/Types"
import type { ResizeHandle } from "../../types/selection"
import { hitTestResizeHandles  } from "../../selection/hitTestResizeHandles"
import { getRectangleBounds } from "./getRectangleBounds"

export function getResizeHandleRectangle(
  object: Rectangle,
  point: Point,
  camera: Camera
): ResizeHandle | null {

  return hitTestResizeHandles (
    getRectangleBounds(object),
    point,
    camera
  )
}