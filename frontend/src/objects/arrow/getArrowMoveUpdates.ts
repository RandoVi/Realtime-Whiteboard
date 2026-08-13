import type { Arrow } from "./Arrow";

export function getArrowMoveUpdates(
  object: Arrow
) {
  return {
    x: object.x,
    y: object.y,
  }
}