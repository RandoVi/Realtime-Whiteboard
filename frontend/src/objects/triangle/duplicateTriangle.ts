import type { Triangle } from "@common/shapes";

export function duplicateTriangle(
  triangle: Triangle
): Triangle {
  return {
    ...triangle,
    id: crypto.randomUUID(),
    x: triangle.x + 20,
    y: triangle.y + 20,
  }
}