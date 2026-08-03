import type { Rectangle } from "./Rectangle"

export function getRectangleMoveUpdates(
  object: Rectangle
) {
  return {
    x: object.x,
    y: object.y,
  }
}