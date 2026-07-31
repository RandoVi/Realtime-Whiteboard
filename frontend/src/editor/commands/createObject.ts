import type { Object } from "../../types/Object"


type Args = {
  objects: Object[]
  object: Object
}


export function createObject({
  objects,
  object,
}: Args) {

  objects.push(object)

}