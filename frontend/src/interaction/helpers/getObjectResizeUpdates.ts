import type { Object } from "../../types/Object"
import { getObjectHandler } from "../../objects/registry/getObjectHandler"

export function getObjectResizeUpdates(
  object: Object
): Partial<Object> {

  return (
    getObjectHandler(object)
      .getResizeUpdates?.(object)
    ?? {}
  )
}