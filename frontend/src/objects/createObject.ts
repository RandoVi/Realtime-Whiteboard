import type { Point } from '../types/Types'
import type { Tool } from '../types/Tool'
import type { Object } from '../types/Object'

export function createObject(
  tool: Tool,
  point: Point
): Object | null {

  switch (tool) {
    case "rectangle":
      return {
        id: crypto.randomUUID(),
        type: "rectangle",
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        fill: '#90caf9',
        stroke: '#1565c0',
      }

    default:
      return null
  }
}