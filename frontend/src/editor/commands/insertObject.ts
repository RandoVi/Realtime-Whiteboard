import type { Object } from "@common/types"


type Args = {
  objects: Object[]
  object: Object
}


export function insertObject({
  objects,
  object,
}: Args) {

  objects.push(object)

}