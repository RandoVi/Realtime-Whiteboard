import type { Triangle } from "./Triangle"

export function getTriangleMoveUpdates(
  object: Triangle
) {
  return {
    x: object.x,
    y: object.y,
  }
}