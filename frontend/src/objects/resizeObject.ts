import type { Object } from "../types/Object"
import type { ResizeHandle } from "../types/selection"
import { getObjectHandler } from "./registry/getObjectHandler";

export function resizeObject(
  object: Object,
  original: Object,
  handle: ResizeHandle,
  point: { x: number; y: number },
) {
  getObjectHandler(object).resize?.(
    object,
    original,
    handle,
    point,
  )
}