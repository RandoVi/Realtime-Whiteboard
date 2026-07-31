import type { Object } from "../types/Object"
import { normalizeRectangle } from "./normalizeRectangle"

export function normalizeObject(
  object: Object
): Object {

  switch (object.type) {
    case "rectangle":
      return normalizeRectangle(object)
      

    default:
      console.warn(
        `No normalizer for object type: ${object.type}`
      )
      return object
  }
}