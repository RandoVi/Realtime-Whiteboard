import type { MutableRefObject } from "react"
import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"

import { updatePreviewShape } from "../shapes/updatePreviewShape"

type Args = {
  world: Point
  interactionRef: MutableRefObject<Interaction>
  requestRender: () => void
}

export function handleDrawingMouseMove({
  world,
  interactionRef,
  requestRender,
}: Args): boolean {
  if (interactionRef.current.type !== "drawingShape") {
    return false
  }

  const interaction = interactionRef.current

  updatePreviewShape(
    interaction.preview,
    interaction.start,
    world,
  )

  requestRender()

  return true
}