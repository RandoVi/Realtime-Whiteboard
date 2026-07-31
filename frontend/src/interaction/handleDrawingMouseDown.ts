import type { MutableRefObject } from "react"
import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"
import type { Tool } from "../types/Tool"

import { createShape } from "../shapes/createShape"

type Args = {
  tool: Tool
  world: Point
  interactionRef: MutableRefObject<Interaction>
}
// Handles the mouse down event when starting to draw a shape
export function handleDrawingMouseDown({
  tool,
  world,
  interactionRef,
}: Args): boolean {
  const shape = createShape(tool, world)

  if (!shape) {
    return false
  }

  interactionRef.current = {
    type: "drawingShape",
    start: world,
    preview: shape,
  }

  return true
}