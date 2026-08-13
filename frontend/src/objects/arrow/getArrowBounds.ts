import type { SelectionBounds } from "../../selection/getSelectionBounds";
import type { Arrow } from "./Arrow";

export function getArrowBounds(
  object: Arrow
): SelectionBounds {

  return {
    left: object.x,
    top: object.y,
    right: object.x + object.width,
    bottom: object.y + object.height,

    width: object.width,
    height: object.height,

    center: {
      x: object.x + object.width / 2,
      y: object.y + object.height / 2,
    },
  }
}