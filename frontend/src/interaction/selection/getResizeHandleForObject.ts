import type { Point, BoardObject } from "@common/types"
import type { Camera } from "../../camera/Camera"
import type { ResizeHandle } from "../../types/selection"
import { getObjectHandler } from "../../objects/registry/getObjectHandler"


export function getResizeHandleForObject(
  object: BoardObject,
  point: Point,
  camera: Camera
): ResizeHandle | null {

  return (
    getObjectHandler(object)
      .getResizeHandle?.(
        object,
        point,
        camera
      )
    ?? null
  )
}