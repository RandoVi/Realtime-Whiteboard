import type { Point } from "@common/types";
import type { Rectangle } from "@common/shapes";

export function updateRectanglePreview(
  rectangle: Rectangle,
  start: Point,
  current: Point,
  constrain: boolean,
) {
  const dx = current.x - start.x;
  const dy = current.y - start.y;

  if (!constrain) {
    rectangle.width = dx;
    rectangle.height = dy;
    return;
  }

  const size = Math.max(
    Math.abs(dx),
    Math.abs(dy),
  );

  rectangle.width = Math.sign(dx) * size;
  rectangle.height = Math.sign(dy) * size;
}