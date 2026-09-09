import type { Stroke } from "@common/shapes";
import type { Point } from "@common/types";

export function updateStrokePreview(
  stroke: Stroke,
  start: Point,
  current: Point,
  constrain: boolean,
) {
  if (constrain) {
    stroke.points = [
      { ...start },
      { ...current },
    ];

    return;
  }

  stroke.points.push({ ...current });
}