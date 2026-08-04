import { rectangleHandler } from "../rectangle/rectangleHandler"
import { circleHandler } from "../circle/circleHandler"
import { strokeHandler } from "../stroke/strokeHandler"
// import { arrowHandler } from "../arrow/arrowHandler"
import type { ObjectHandler } from "./ObjectHandler"
import type { Object } from "../../types/Object"
import { triangleHandler } from "../triangle/triangleHandler"

export const objectHandlers = {
  rectangle: rectangleHandler,
  circle: circleHandler,
  stroke: strokeHandler,
  triangle: triangleHandler,
//   arrow: arrowHandler,
} satisfies {
  [K in Object["type"]]: ObjectHandler<Extract<Object, { type: K }>>
}