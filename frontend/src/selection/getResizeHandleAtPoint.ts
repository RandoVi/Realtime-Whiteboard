import type { Point, Camera } from "../types/Types"
import type { Shape } from "../types/Shape"
import type { ResizeHandle } from "../types/selection"

import { getSelectionBounds } from "./getSelectionBounds"
import { getResizeHandles } from "./getResizeHandles"
import { hitTestHandle } from "../shapes/hitTestHandle"

export function getResizeHandleAtPoint(
  shape: Shape,
  pointer: Point,
  camera: Camera,
): ResizeHandle | null {
  if (shape.type !== "rectangle") {
    return null
  }

  const bounds = getSelectionBounds(shape)
  const handles = getResizeHandles(bounds, camera)

  return hitTestHandle(pointer, handles)
}