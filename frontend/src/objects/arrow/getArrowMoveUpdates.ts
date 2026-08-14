import type { Arrow } from "@common/shapes";

export function getArrowMoveUpdates(
  object: Arrow
) {
  return {
    x: object.x,
    y: object.y,
  }
}