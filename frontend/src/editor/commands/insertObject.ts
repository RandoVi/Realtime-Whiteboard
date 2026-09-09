import type { BoardObject } from "@common/types"


type Args = {
  objects: BoardObject[]
  object: BoardObject
}


export function insertObject({
  objects,
  object,
}: Args) {

  objects.push(object)

}