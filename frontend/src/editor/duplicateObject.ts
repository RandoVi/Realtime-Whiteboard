import type { BoardObject } from "@common/types"
import { getObjectHandler } from "./../objects/registry/getObjectHandler"

export function duplicateObject(
  object: BoardObject
): BoardObject {

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