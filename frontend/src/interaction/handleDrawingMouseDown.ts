import type { MutableRefObject } from "react"
import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"
import type { Tool } from "../types/Tool"

import { createObject } from "../objects/createObject"

type Args = {
  tool: Tool
  world: Point
  interactionRef: MutableRefObject<Interaction>
}
// Handles the mouse down event when starting to draw an object
export function handleDrawingMouseDown({
  tool,
  world,
  interactionRef,
}: Args): boolean {
  const object = createObject(tool, world)

  if (!object) {
    return false
  }

  interactionRef.current = {
    type: "drawingObject",
    start: world,
    preview: object,
  }

  return true
}