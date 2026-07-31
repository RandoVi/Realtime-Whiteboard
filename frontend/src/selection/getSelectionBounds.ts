import type { Object } from "../types/Object"
import type { Point } from "../types/Types"

export type SelectionBounds = {
  left: number
  top: number
  right: number
  bottom: number

  width: number
  height: number

  center: Point
}

// Returns the selection bounds for a given object.
export function getSelectionBounds(object: Object): SelectionBounds {
  switch (object.type) {
    case 'rectangle': {
      return {
        left: object.x,
        top: object.y,
        right: object.x + object.width,
        bottom: object.y + object.height,

        width: object.width,
        height: object.height,

        center: {
          x: object.x + object.width / 2,
          y: object.y + object.height / 2,
        },
      }
    }

    default:
      throw new Error(`Unsupported object type: ${object.type}`)
  }
}