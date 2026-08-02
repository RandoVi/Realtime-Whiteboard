import type { Point } from '../types/Types'
import type { Tool } from '../types/Tool'
import type { Object } from '../types/Object'
import { createStroke } from './stroke/createStroke'
import { createRectangle } from './rectangle/createRectangle'
import { createCircle } from './circle/createCircle'

export function createObject(
  tool: Tool,
  point: Point
): Object | null {

  switch (tool) {
    case "rectangle":
      return createRectangle(point)

    case "stroke":
      return createStroke(point)

    case "circle":
      return createCircle(point)
      
    default:
      return null
  }
}