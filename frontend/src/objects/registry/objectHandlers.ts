import { rectangleHandler } from "../rectangle/rectangleHandler"
import { circleHandler } from "../circle/circleHandler"
import { strokeHandler } from "../stroke/strokeHandler"
import type { ObjectHandler } from "./ObjectHandler"
import type { BoardObject } from "@common/types"
import { triangleHandler } from "../triangle/triangleHandler"
import { laserHandler } from "../laser/laserHandler"
import { arrowHandler } from "../arrow/arrowHandler"
import { textboxHandler } from "../textbox/textboxHandler"
import { textHandler } from "../text/textHandler"

export const objectHandlers = {
  rectangle: rectangleHandler,
  circle: circleHandler,
  stroke: strokeHandler,
  triangle: triangleHandler,
  laser: laserHandler,
  arrow: arrowHandler,
  textbox: textboxHandler,
  text: textHandler,
} satisfies {
  [K in BoardObject["type"]]: ObjectHandler<Extract<BoardObject, { type: K }>>
}