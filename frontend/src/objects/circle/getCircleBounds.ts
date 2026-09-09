import type { Circle } from "@common/shapes"
import type { SelectionBounds } from "../../interaction/selection/getSelectionBounds"

export function getCircleBounds(
  object: Circle
): SelectionBounds {

  const strokePadding = object.strokeWidth / 2;

  const radius = object.radius + strokePadding;

  return {
    left: object.x - radius,
    top: object.y - radius,
    right: object.x + radius,
    bottom: object.y + radius,

    width: radius * 2,
    height: radius * 2,

    center: {
      x: object.x,
      y: object.y,
    },

    rotation: object.rotation,
  }
}