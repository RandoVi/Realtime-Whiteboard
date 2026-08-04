import type { Circle } from "./Circle"

export function getCircleMoveUpdates(
  object: Circle
) {
  return {
    x: object.x,
    y: object.y,
  }
}