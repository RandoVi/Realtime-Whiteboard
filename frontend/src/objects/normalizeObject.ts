

import type { Object } from "../types/Object"
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