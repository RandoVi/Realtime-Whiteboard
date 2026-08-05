import type { Point } from "../../types/Types"
import type { Tool } from "../../types/Tool"
import { createObject } from "../../objects/createObject"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
  tool: Tool
  world: Point
  context: CanvasInteractionContext;
}
// Handles the mouse down event when starting to draw an object
export function beginDrawing({
  tool,
  world,
  context,
}: Args): boolean {
  const object = createObject(tool, world, context.objectStyle)

  if (!object) {
    return false
  }

  context.interactionRef.current = {
    type: "drawing",
    start: world,
    preview: object,
  }

  return true
}