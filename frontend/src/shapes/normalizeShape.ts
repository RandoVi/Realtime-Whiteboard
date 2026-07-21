import type { Shape } from "../types/Shape"
import { normalizeRectangle } from "./normalizeRectangle"

export function normalizeShape(
  shape: Shape
): Shape {

  switch (shape.type) {
    case "rectangle":
      return normalizeRectangle(shape)
      

    default:
      console.warn(
        `No normalizer for shape type: ${shape.type}`
      )
      return shape
  }
}