import { hitTestResizeHandles } from "../../selection/hitTestResizeHandles";
import type { ResizeHandle } from "../../types/selection";
import type { Camera } from "../../types/Types";
import type { Point } from "@common/types";
import type { Arrow } from "@common/shapes";
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