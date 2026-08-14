import type { Object } from "@common/types"
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