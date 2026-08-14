import type { Rectangle } from "@common/shapes"

export function getRectangleMoveUpdates(
  object: Rectangle
) {
  return {
    x: object.x,
    y: object.y,
  }
}