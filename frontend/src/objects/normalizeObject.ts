
import type { BoardObject } from "@common/types"
import { getObjectHandler } from "./registry/getObjectHandler"

export function normalizeObject(
  object: BoardObject,
): BoardObject {
  return (
    getObjectHandler(object)
      .normalize?.(object)
    ?? object
  )
}