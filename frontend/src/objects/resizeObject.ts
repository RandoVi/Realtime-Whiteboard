import type { Object } from "../types/Object"
import type { ResizeHandle } from "../types/selection"
import { getObjectHandler } from "./registry/getObjectHandler";

export function resizeObject(
  object: Object,
  original: Object,
  handle: ResizeHandle,
  point: { x: number; y: number },
) {
  console.log("Resizing object", object, original, handle, point)
  getObjectHandler(object).resize?.(
    object,
    original,
    handle,
    point,
  )
}