import type { Circle } from "@common/shapes"
import type { SelectionBounds } from "../../selection/getSelectionBounds"

export function getCircleBounds(
  object: Circle
): SelectionBounds {

  return {
    left: object.x - object.radius,
    top: object.y - object.radius,
    right: object.x + object.radius,
    bottom: object.y + object.radius,

    width: object.radius * 2,
    height: object.radius * 2,

    center: {
      x: object.x,
      y: object.y,
    },
  }
}