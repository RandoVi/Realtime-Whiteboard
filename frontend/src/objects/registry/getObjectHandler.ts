import type { Object } from "@common/types"
import { objectHandlers } from "./objectHandlers"

export function getObjectHandler(
  object: Object
) {
  return objectHandlers[object.type] as any
}