import type { Object } from "@common/types"
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