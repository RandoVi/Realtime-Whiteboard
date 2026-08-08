import type { Object } from "../types/Object"
import type { Point } from "../types/Types"
import { getObjectHandler } from "../objects/registry/getObjectHandler"

export type SelectionBounds = {
  left: number
  top: number
  right: number
  bottom: number

  width: number
  height: number

  center: Point
}

export function getSelectionBounds(
  object: Object
): SelectionBounds {
  return getObjectHandler(object).getBounds(object);
}