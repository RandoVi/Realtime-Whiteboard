import type { Triangle } from "@common/shapes";

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