import type { Point } from "@common/types";
import type { Triangle } from "@common/shapes";
import type { Camera } from "../../types/Types"
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