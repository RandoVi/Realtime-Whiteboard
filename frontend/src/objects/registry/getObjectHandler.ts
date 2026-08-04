import type { Object } from "../../types/Object"
import { objectHandlers } from "./objectHandlers"

export function getObjectHandler(
  object: Object
) {
  return objectHandlers[object.type] as any
}