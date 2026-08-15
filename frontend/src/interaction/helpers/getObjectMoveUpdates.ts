import type { Object } from "@common/types"
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