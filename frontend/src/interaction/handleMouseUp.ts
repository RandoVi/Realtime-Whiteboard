
import { handleDrawingMouseUp } from "./drawing/finish"
import { handleResizeMouseUp } from "./resizing/finishResize"

import { handleMovingObjectMouseUp } from "./moving/finish"
import { handlePanMouseUp } from "./panning/finishPan"
import type { CanvasInteractionContext } from "./CanvasInteractionContext"

type Args = {
  context: CanvasInteractionContext
}

// Handles the mouse up event for various interactions
export function handleMouseUp({
  context
}: Args) {

  const interaction = context.interactionRef.current

  switch (interaction.type) {

    case "drawing":
      handleDrawingMouseUp({
        context
      })
      break

    case "moving":
      handleMovingObjectMouseUp({
        context
      })
      break

    case "resizing":
      handleResizeMouseUp({
        context
      })
      break

    case "panning":
      handlePanMouseUp({
        context
      })
      break
  }
}