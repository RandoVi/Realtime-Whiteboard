import type { BoardObject } from "@common/types"
import { getObjectHandler } from "../../objects/registry/getObjectHandler"

export function getObjectMoveUpdates(
  object: BoardObject
): Partial<BoardObject> {

  return (
    getObjectHandler(object)
      .getMoveUpdates?.(object)
    ?? {}
  )
}