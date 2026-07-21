import type { Shape } from "../types/Shape"
import type { ResizeHandle } from "../types/selection"
import { resizeRectangle } from "./resizeRectangle"

export function resizeShape(
  shape: Shape,
  original: Shape,
  handle: ResizeHandle,
  point: { x: number; y: number }
) {
  switch (shape.type) {
    case "rectangle":
      if (original.type === "rectangle") {
        resizeRectangle(
          shape,
          original,
          handle,
          point
        )
      }
      break

    default:
      console.warn(
        `Resize not implemented for shape type: ${shape.type}`
      )
  }
}