import type { Triangle } from "./Triangle"

export function getTriangleResizeUpdates(
  object: Triangle
) {
  return {
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
  }
}