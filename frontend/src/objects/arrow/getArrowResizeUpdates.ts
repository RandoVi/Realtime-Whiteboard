import type { Arrow } from "./Arrow";

export function getArrowResizeUpdates(
  object: Arrow
) {
  return {
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
  }
}