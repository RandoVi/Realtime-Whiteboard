import type { Shape } from "../types/Shape"

export function getShapeById(
  shapes: Shape[],
  id: string,
): Shape | undefined {
  return shapes.find(shape => shape.id === id)
}