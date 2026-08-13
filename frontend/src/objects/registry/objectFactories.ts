import { createRectangle } from "../rectangle/createRectangle"
import { createCircle } from "../circle/createCircle"
import { createStroke } from "../stroke/createStroke"
import { createTriangle } from "../triangle/createTriangle"
import { createLaser } from "../laser/createLaser"
 import { createArrow } from "../arrow/createArrow"


export const objectFactories = {
  rectangle: createRectangle,
  circle: createCircle,
  stroke: createStroke,
  triangle: createTriangle,
  laser: createLaser,
  arrow: createArrow,
}