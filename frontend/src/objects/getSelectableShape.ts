import type { Object } from "../types/Object"

export function getSelectableShape(shape: Object | undefined) {
  if (!shape) return undefined

  switch (shape.type) {
    case "rectangle":
      return shape

    default:
      return undefined
  }
}