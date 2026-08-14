import type { Circle } from "@common/shapes";
import type { ResizeHandle } from "../../types/selection";

export function resizeCircle(
  circle: Circle,
  original: Circle,
  _handle: ResizeHandle,
  point: { x: number; y: number }
) {
  circle.x = original.x
  circle.y = original.y

  const dx = Math.abs(point.x - original.x)
  const dy = Math.abs(point.y - original.y)

  circle.radius = Math.max(dx, dy)
}