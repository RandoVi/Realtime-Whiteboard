import type { Rectangle } from "./Rectangle"

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