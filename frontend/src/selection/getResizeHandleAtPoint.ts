import type { Point, Camera } from "../types/Types"
import type { Object } from "../types/Object"
import type { ResizeHandle } from "../types/selection"

import { getSelectionBounds } from "./getSelectionBounds"
import { getResizeHandles } from "./getResizeHandles"
import { hitTestHandle } from "../objects/hitTestHandle"

export function getResizeHandleAtPoint(
  object: Object,
  pointer: Point,
  camera: Camera,
): ResizeHandle | null {

  if (
    object.type !== "rectangle" &&
    object.type !== "circle"
  ) {
    return null
  }

  const bounds = getSelectionBounds(object)
  const handles = getResizeHandles(bounds, camera)

  return hitTestHandle(pointer, handles)
}