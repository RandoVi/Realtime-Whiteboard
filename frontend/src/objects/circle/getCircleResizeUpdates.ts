import type { Circle } from "@common/shapes"

export function getCircleResizeUpdates(
  object: Circle
) {
  return {
    x: object.x,
    y: object.y,
    radius: object.radius,
  }
}