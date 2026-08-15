import type { Triangle } from "@common/shapes";

export function getTriangleMoveUpdates(
  object: Triangle
) {
  return {
    x: object.x,
    y: object.y,
    rotation: object.rotation,
  }
}