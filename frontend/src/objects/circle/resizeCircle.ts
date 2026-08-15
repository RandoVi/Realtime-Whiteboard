import type { Circle } from "@common/shapes";
import type { ResizeHandle } from "../../types/selection";
import { inverseRotatePoint } from "../../interaction/helpers/rotatePoint";

export function resizeCircle(
  circle: Circle,
  original: Circle,
  _handle: ResizeHandle,
  point: { x: number; y: number }
) {
  const localPoint = inverseRotatePoint(
    point,
    {
      x: original.x,
      y: original.y,
    },
    original.rotation,
  )

  circle.x = original.x
  circle.y = original.y
  circle.rotation = original.rotation

  const dx = Math.abs(localPoint.x - original.x)
  const dy = Math.abs(localPoint.y - original.y)

  circle.radius = Math.max(dx, dy)
}