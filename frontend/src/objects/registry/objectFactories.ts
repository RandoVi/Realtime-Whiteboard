import { createRectangle } from "../rectangle/createRectangle"
import { createCircle } from "../circle/createCircle"
import { createStroke } from "../stroke/createStroke"
// import { createArrow } from "../arrow/createArrow"


export const objectFactories = {
  rectangle: createRectangle,
  circle: createCircle,
  stroke: createStroke,
//   arrow: createArrow,
}