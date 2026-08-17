import type { Point } from "@common/types";
import type { Triangle } from "@common/shapes";
import type { Camera } from "../../camera/Camera";
import type { ResizeHandle } from "../../types/selection"
import { hitTestResizeHandles  } from "../../interaction/selection/hitTestResizeHandles"
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