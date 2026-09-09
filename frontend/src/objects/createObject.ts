import type { Point, BoardObject } from "@common/types"
import type { Tool } from "../types/Tool"

import { objectFactories } from "./registry/objectFactories"
import type {ObjectStyle} from "./ObjectStyle"

export function createObject(
  tool: Tool,
  point: Point,
  style: ObjectStyle
): BoardObject | null {

  if (!(tool in objectFactories)) {
    return null
  }

  const factory = objectFactories[
    tool as keyof typeof objectFactories
  ]

  return factory(point, style) as BoardObject
}