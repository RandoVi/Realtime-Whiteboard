import type { Object, Point } from "@common/types"
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