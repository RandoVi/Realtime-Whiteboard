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

  const bounds =
    getObjectHandler(object)
      .getBounds?.(object)

  if (!bounds) {
    throw new Error(
      `Object type ${object.type} has no bounds`
    )
  }

  return bounds
}