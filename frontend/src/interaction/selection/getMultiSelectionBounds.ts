import type { BoardObject, Point } from "@common/types";
import { getObjectHandler } from "../../objects/registry/getObjectHandler";

export type MultiSelectionBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;

  width: number;
  height: number;

  center: Point;

  rotation: number;
};

export function getMultiSelectionBounds(
  objects: BoardObject[],
): MultiSelectionBounds | undefined {

  if (objects.length === 0) {
    return undefined;
  }

  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (const object of objects) {
    const bounds =
      getObjectHandler(object).getBounds(object);

    left = Math.min(left, bounds.left);
    top = Math.min(top, bounds.top);
    right = Math.max(right, bounds.right);
    bottom = Math.max(bottom, bounds.bottom);
  }

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

    // A multi-selection currently has no single rotation.
    rotation: 0,
  };
}