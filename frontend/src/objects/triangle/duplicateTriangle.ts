import type { Triangle } from "./Triangle";

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