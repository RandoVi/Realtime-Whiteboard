import type { Rectangle } from "./Rectangle";

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