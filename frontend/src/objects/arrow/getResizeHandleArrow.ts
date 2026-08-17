import { hitTestResizeHandles } from "../../interaction/selection/hitTestResizeHandles";
import type { ResizeHandle } from "../../types/selection";
import type { Camera } from "../../camera/Camera";
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