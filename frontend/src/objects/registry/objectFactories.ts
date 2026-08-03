import { createRectangle } from "../rectangle/createRectangle"
import { createCircle } from "../circle/createCircle"
import { createStroke } from "../stroke/createStroke"


export const objectFactories = {
  rectangle: createRectangle,
  circle: createCircle,
  stroke: createStroke,
}