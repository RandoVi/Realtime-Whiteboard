import type { BoardObject } from "@common/types"
import { getObjectHandler } from "../../objects/registry/getObjectHandler"

export function getObjectResizeUpdates(
  object: BoardObject
): Partial<BoardObject> {

  return (
    getObjectHandler(object)
      .getResizeUpdates?.(object)
    ?? {}
  )
}