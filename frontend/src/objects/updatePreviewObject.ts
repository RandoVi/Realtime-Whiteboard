import type { Object } from '../types/Object'
import type { Point } from '../types/Types'

export function updatePreviewObject(
  object: Object,
  start: Point,
  current: Point,
) {
  switch (object.type) {
    case "rectangle":
      object.width = current.x - start.x
      object.height = current.y - start.y
      break

    default:
      console.warn(
        `No preview updater for shape type: ${object.type}`
      )
  }
}