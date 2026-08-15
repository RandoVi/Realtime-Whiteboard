import type { Circle } from "@common/shapes";

export function moveCircle(
  circle: Circle,
  original: Circle,
  dx: number,
  dy: number,
) {
  circle.x = original.x + dx
  circle.y = original.y + dy
  circle.rotation = original.rotation
}