import type { Point, Camera } from "../../Types"
import type { Shape } from "../../shapes/Shape"
import type { ResizeHandle } from "../../tools/selection"

import { getSelectionBounds } from "./getSelectionBounds"
import { getResizeHandles } from "./getResizeHandles"
import { hitTestHandle } from "../../tools/hitTestHandle"

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