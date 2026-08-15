import type { Camera } from "../types/Types"
import type { Point } from "@common/types";
import type { ResizeHandle } from "../types/selection"

import { getResizeHandles } from "./getResizeHandles"
import { hitTestHandle } from "../objects/hitTestHandle"
import type { SelectionBounds } from "./getSelectionBounds"


export function hitTestResizeHandles(
  bounds: SelectionBounds,
  pointer: Point,
  camera: Camera,
): ResizeHandle | null {

  const handles = getResizeHandles(
    bounds,
    camera
  )

  return hitTestHandle(
    pointer,
    handles
  )
}