import type { Point } from "../../types/Types"
import type { ObjectStyle } from "../ObjectStyle"
import type { Arrow } from "./Arrow"

export function createArrow(point: Point, style: ObjectStyle): Arrow {
  return {
    id: crypto.randomUUID(),
    type: "arrow",

    x: point.x,
    y: point.y,

    width: 0,
    height: 0,
    fill: style.fill,
    stroke: style.stroke,
  }
}