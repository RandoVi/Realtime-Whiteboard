import type { Rectangle } from "@common/shapes"

export function getRectangleResizeUpdates(
  object: Rectangle
) {
  return {
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
  }
}