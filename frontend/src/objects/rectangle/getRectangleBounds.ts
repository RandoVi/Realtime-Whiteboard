import type { Rectangle } from "@common/shapes"
import type { SelectionBounds } from "../../selection/getSelectionBounds"

export function getRectangleBounds(
  object: Rectangle
): SelectionBounds {

  return {
    left: object.x,
    top: object.y,
    right: object.x + object.width,
    bottom: object.y + object.height,

    width: object.width,
    height: object.height,

    center: {
      x: object.x + object.width / 2,
      y: object.y + object.height / 2,
    },
  }
}