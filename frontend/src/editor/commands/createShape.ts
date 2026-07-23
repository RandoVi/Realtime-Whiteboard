import type { Shape } from "../../types/Shape"


type Args = {
  shapes: Shape[]
  shape: Shape
}


export function createShape({
  shapes,
  shape,
}: Args) {

  shapes.push(shape)

}