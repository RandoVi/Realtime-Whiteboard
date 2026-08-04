import type { Object } from "../types/Object"
import type { Point } from "../types/Types"
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