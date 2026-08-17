import type { BoardObject } from "@common/types"
import { getObjectHandler } from "./registry/getObjectHandler"
import type { ObjectProperty } from "./properties/ObjectProperty"

export function getObjectProperties(
  object: BoardObject
): ObjectProperty[] {

  return (
    getObjectHandler(object)
      .properties
    ?? []
  )
}