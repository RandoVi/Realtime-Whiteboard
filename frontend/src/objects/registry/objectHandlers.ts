import { rectangleHandler } from "../rectangle/rectangleHandler"
import { circleHandler } from "../circle/circleHandler"
import { strokeHandler } from "../stroke/strokeHandler"
// import { arrowHandler } from "../arrow/arrowHandler"
import type { ObjectHandler } from "./ObjectHandler"
import type { Object } from "@common/types"
import { triangleHandler } from "../triangle/triangleHandler"
import { laserHandler } from "../laser/laserHandler"
import { arrowHandler } from "../arrow/arrowHandler"
import { textboxHandler } from "../textbox/textboxHandler"

export const objectHandlers = {
  rectangle: rectangleHandler,
  circle: circleHandler,
  stroke: strokeHandler,
  triangle: triangleHandler,
  laser: laserHandler,
  arrow: arrowHandler,
  textbox: textboxHandler,
//   arrow: arrowHandler,
} satisfies {
  [K in Object["type"]]: ObjectHandler<Extract<Object, { type: K }>>
}