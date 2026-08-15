import type { Stroke } from "@common/shapes";
export function getStrokeMoveUpdates(
  object: Stroke
) {
  return {
    points: object.points,
  }
}