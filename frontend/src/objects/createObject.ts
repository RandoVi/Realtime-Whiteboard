import type { Point } from "../types/Types"
import type { Tool } from "../types/Tool"
import type { Object } from "../types/Object"

import { objectFactories } from "./registry/objectFactories"
import type {ObjectStyle} from "./ObjectStyle"

export function createObject(
  tool: Tool,
  point: Point,
  style: ObjectStyle
): Object | null {

  if (!(tool in objectFactories)) {
    return null
  }

  const factory = objectFactories[
    tool as keyof typeof objectFactories
  ]

  return factory(point, style) as Object
}