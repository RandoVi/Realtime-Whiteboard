import type { Arrow } from "@common/shapes";

export function duplicateArrow(
  arrow: Arrow
): Arrow {
  return {
    ...arrow,
    id: crypto.randomUUID(),
    x: arrow.x + 20,
    y: arrow.y + 20,
  }
}