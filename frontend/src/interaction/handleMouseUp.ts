
import { finishDrawing } from "./drawing/finishDrawing"
import { handleResizeMouseUp } from "./resizing/finishResize"
import { finishMoving } from "./moving/finishMoving"
import { finishPan } from "./panning/finishPan"
import type { CanvasInteractionContext } from "./CanvasInteractionContext"
import { finishLaser } from "./laser/finishLaser"
import { finishRotation } from "./rotation/finishRotation"

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
      finishDrawing({
        context
      })
      break

    case "laser":
      finishLaser({
        context
      });
      break;

    case "moving":
      finishMoving({
        context
      })
      break

    case "resizing":
      handleResizeMouseUp({
        context
      })
      break

    case "rotating":
      finishRotation({
        context,
      })
      break

    case "panning":
      finishPan({
        context
      })
      break
  }
}