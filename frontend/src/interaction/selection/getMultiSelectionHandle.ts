import type { BoardObject, Point } from "@common/types";
import type { Camera } from "../../camera/Camera";
import type { ResizeHandle } from "../../types/selection";
import {
  getMultiSelectionBounds,
} from "./getMultiSelectionBounds";
import {
  getResizeHandles,
} from "./getResizeHandles";

export function getMultiSelectionHandle(
  objects: BoardObject[],
  pointer: Point,
  camera: Camera,
): ResizeHandle | null {

  const bounds = getMultiSelectionBounds(objects);

  if (!bounds) {
    return null;
  }

  const handles = getResizeHandles(
    bounds,
    camera,
    ["nw", "ne", "sw", "se"],
  );

  const hitSize = 12;

  for (const handle of handles) {
    if (
      Math.abs(pointer.x - handle.x) <= hitSize &&
      Math.abs(pointer.y - handle.y) <= hitSize
    ) {
      return handle.type;
    }
  }

  return null;
}