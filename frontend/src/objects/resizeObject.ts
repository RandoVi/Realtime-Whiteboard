import type { Object } from "../types/Object"
import type { ResizeHandle } from "../types/selection"
import { resizeCircle } from "./circle/resizeCircle";
import { resizeRectangle } from "./rectangle/resizeRectangle"

export function resizeObject(
  object: Object,
  original: Object,
  handle: ResizeHandle,
  point: { x: number; y: number }
) {
  switch (object.type) {
    case "rectangle":
      if (original.type === "rectangle") {
        resizeRectangle(object, original, handle, point)
      }
      break

    case "circle":
      if (original.type === "circle") {
        resizeCircle(object, original, handle, point)
      }
      break

    default:
      console.warn(
        `Resize not implemented for object type: ${object.type}`
      )
  }
}