import type { SelectionBounds } from "../../interaction/selection/getSelectionBounds";
import type { Point } from "@common/types";
import type { Stroke } from "@common/shapes";

export function getStrokeBounds(
  stroke: Stroke
): SelectionBounds {
  if (stroke.points.length === 0) {
    const center: Point = {
      x: 0,
      y: 0,
    };

    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      center,
    };
  }

  let left = stroke.points[0].x;
  let right = stroke.points[0].x;
  let top = stroke.points[0].y;
  let bottom = stroke.points[0].y;

  for (const point of stroke.points) {
    left = Math.min(left, point.x);
    right = Math.max(right, point.x);
    top = Math.min(top, point.y);
    bottom = Math.max(bottom, point.y);
  }

  const padding = stroke.strokeWidth / 2;

  left -= padding;
  right += padding;
  top -= padding;
  bottom += padding;

  const width = right - left;
  const height = bottom - top;

  return {
    left,
    top,
    right,
    bottom,
    width,
    height,
    center: {
      x: left + width / 2,
      y: top + height / 2,
    },
  };
}