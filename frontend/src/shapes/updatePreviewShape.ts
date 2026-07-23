import type { Shape } from '../types/Shape'
import type { Point } from '../types/Types'

export function updatePreviewShape(
  shape: Shape,
  start: Point,
  current: Point,
) {
  switch (shape.type) {
    case "rectangle":
      shape.width = current.x - start.x
      shape.height = current.y - start.y
      break

    default:
      console.warn(
        `No preview updater for shape type: ${shape.type}`
      )
  }
}