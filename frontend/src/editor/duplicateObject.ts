import type { Object } from "@common/types"
import { getObjectHandler } from "./../objects/registry/getObjectHandler"

export function duplicateObject(
  object: Object
): Object {

  const duplicate =
    getObjectHandler(object)
      .duplicate(object)

  if (!duplicate) {
    throw new Error(
      `Object ${object.type} cannot be duplicated`
    )
  }

  return duplicate
}