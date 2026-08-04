import type { Circle } from "./Circle"

export function getCircleResizeUpdates(
  object: Circle
) {
  return {
    x: object.x,
    y: object.y,
    radius: object.radius,
  }
}