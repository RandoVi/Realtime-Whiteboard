import type { Stroke } from "./Stroke"

export function getStrokeMoveUpdates(
  object: Stroke
) {
  return {
    points: object.points,
  }
}