import type { Point } from '../Types'
import type { Tool } from '../tools/Tool'
import type { Shape } from './Shape'

export function createShape(
  tool: Tool,
  point: Point
): Shape | null {

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