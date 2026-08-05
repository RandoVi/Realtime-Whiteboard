import type { Object } from "../../types/Object"


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