import type { Rectangle } from "@common/shapes"

export function duplicateRectangle(
  rectangle: Rectangle
): Rectangle {
  return {
    ...rectangle,
    id: crypto.randomUUID(),
    x: rectangle.x + 20,
    y: rectangle.y + 20,
  }
}