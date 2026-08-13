import { hitTestResizeHandles } from "../../selection/hitTestResizeHandles";
import type { ResizeHandle } from "../../types/selection";
import type { Point, Camera } from "../../types/Types";
import type { Arrow } from "./Arrow";
import { getArrowBounds } from "./getArrowBounds";

export function getResizeHandleArrow(
  object: Arrow,
  point: Point,
  camera: Camera
): ResizeHandle | null {

  return hitTestResizeHandles (
    getArrowBounds(object),
    point,
    camera
  )
}