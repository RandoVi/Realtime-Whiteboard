import type { Point } from "@common/types"
import type { Arrow } from "@common/shapes"
import type { ObjectStyle } from "../ObjectStyle"

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