import type { Point, BoardObject } from "@common/types"
import { getObjectHandler } from "./registry/getObjectHandler"


export function updatePreviewObject(
  object: BoardObject,
  start: Point,
  current: Point,
  constrain: boolean
) {
    getObjectHandler(object)
      .updatePreview?.(
        object,
        start,
        current,
        constrain,
      )
}