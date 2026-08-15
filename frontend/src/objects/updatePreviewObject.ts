import type { Point, Object } from "@common/types"
import { getObjectHandler } from "./registry/getObjectHandler"


export function updatePreviewObject(
  object: Object,
  start: Point,
  current: Point,
) {
    getObjectHandler(object)
      .updatePreview?.(
        object,
        start,
        current,
      )
}