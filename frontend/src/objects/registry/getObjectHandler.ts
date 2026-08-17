import type { BoardObject } from "@common/types"
import { objectHandlers } from "./objectHandlers"

export function getObjectHandler(
  object: BoardObject
) {
  return objectHandlers[object.type] as any
}