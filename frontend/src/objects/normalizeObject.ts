
import type { Object } from "@common/types"
import { getObjectHandler } from "./registry/getObjectHandler"

export function normalizeObject(
  object: Object,
): Object {
  return (
    getObjectHandler(object)
      .normalize?.(object)
    ?? object
  )
}