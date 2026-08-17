import type { BoardObject } from "@common/types"
import type { ResizeHandle } from "../types/selection"
import { getObjectHandler } from "./registry/getObjectHandler";

export function resizeObject(
  object: BoardObject,
  original: BoardObject,
  handle: ResizeHandle,
  point: { x: number; y: number },
  constrain: boolean,
) {
  console.log("Resizing object", object, original, handle, point, constrain)
  getObjectHandler(object).resize?.(
    object,
    original,
    handle,
    point,
    constrain
  )
}