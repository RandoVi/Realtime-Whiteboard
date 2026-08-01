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

    case "circle":

      const dx = current.x - start.x
      const dy = current.y - start.y

      object.radius = Math.sqrt(
        dx * dx + dy * dy
      )

      break

    case "stroke":
      object.points.push(current)
      break
  }
}