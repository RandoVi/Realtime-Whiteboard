import type { Shape } from "./Shape"

export function getSelectableShape(shape: Shape | undefined) {
  if (!shape) return undefined

  switch (shape.type) {
    case "rectangle":
      return shape

    default:
      return undefined
  }
}