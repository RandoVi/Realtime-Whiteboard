import { rectangleHandler } from "../rectangle/rectangleHandler"
import { circleHandler } from "../circle/circleHandler"
import { strokeHandler } from "../stroke/strokeHandler"

export const objectHandlers = {
  rectangle: rectangleHandler,
  circle: circleHandler,
  stroke: strokeHandler,
}