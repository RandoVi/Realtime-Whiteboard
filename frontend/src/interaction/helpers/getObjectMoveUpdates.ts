import type { Object } from "../../types/Object"
import { getObjectHandler } from "../../objects/registry/getObjectHandler"

export function getObjectMoveUpdates(
  object: Object
): Partial<Object> {

  return (
    getObjectHandler(object)
      .getMoveUpdates?.(object)
    ?? {}
  )
}