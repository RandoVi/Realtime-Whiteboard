import type { Object } from "../types/Object"
import { getObjectHandler } from "./registry/getObjectHandler"
import type { ObjectProperty } from "./properties/ObjectProperty"

export function getObjectProperties(
  object: Object
): ObjectProperty[] {

  return (
    getObjectHandler(object)
      .properties
    ?? []
  )
}