import type { Point } from "@common/types";
import type { Stroke } from "@common/shapes";

const HIT_TOLERANCE = 6;

export function hitTestStroke(
  point: Point,
  stroke: Stroke,
): boolean {
  if (stroke.points.length === 0) {
    return false;
  }

  const hitDistance =
    stroke.strokeWidth / 2 + HIT_TOLERANCE;

  if (stroke.points.length === 1) {
    return distanceToPoint(
      point,
      stroke.points[0],
    ) <= hitDistance;
  }

  for (let i = 0; i < stroke.points.length - 1; i++) {
    const start = stroke.points[i];
    const end = stroke.points[i + 1];

    if (
      distanceToSegment(
        point,
        start,
        end,
      ) <= hitDistance
    ) {
      return true;
    }
  }

  return false;
}

function distanceToPoint(
  a: Point,
  b: Point,
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(
    dx * dx + dy * dy
  );
}

function distanceToSegment(
  point: Point,
  start: Point,
  end: Point,
): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (dx === 0 && dy === 0) {
    return distanceToPoint(point, start);
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      (
        (point.x - start.x) * dx +
        (point.y - start.y) * dy
      ) /
      (dx * dx + dy * dy)
    )
  );

  const closest = {
    x: start.x + t * dx,
    y: start.y + t * dy,
  };

  return distanceToPoint(
    point,
    closest,
  );
}