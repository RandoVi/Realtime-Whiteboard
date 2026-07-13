import type { Shape } from "./Shape"

export function getShapeById(
  shapes: Shape[],
  id: string,
): Shape | undefined {
  return shapes.find(shape => shape.id === id)
}