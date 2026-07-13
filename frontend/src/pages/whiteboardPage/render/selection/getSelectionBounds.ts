import type { Shape } from "../../shapes/Shape"
import type { Point } from "../../Types"

export type SelectionBounds = {
  left: number
  top: number
  right: number
  bottom: number

  width: number
  height: number

  center: Point
}

// Returns the selection bounds for a given shape.
export function getSelectionBounds(shape: Shape): SelectionBounds {
  switch (shape.type) {
    case 'rectangle': {
      return {
        left: shape.x,
        top: shape.y,
        right: shape.x + shape.width,
        bottom: shape.y + shape.height,

        width: shape.width,
        height: shape.height,

        center: {
          x: shape.x + shape.width / 2,
          y: shape.y + shape.height / 2,
        },
      }
    }

    default:
      throw new Error(`Unsupported shape type: ${shape.type}`)
  }
}