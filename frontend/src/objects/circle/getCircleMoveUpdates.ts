import type { Circle } from "@common/shapes"

export function getCircleMoveUpdates(
  object: Circle
) {
  return {
    x: object.x,
    y: object.y,
    rotation: object.rotation,
  }
}