import { normalizeObject } from "../../objects/normalizeObject"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
  context: CanvasInteractionContext
}
// Handles the mouse up event when drawing a object
export function finishDrawing({
  context
}: Args): boolean {
  const { interactionRef, editor } = context
  if (interactionRef.current.type !== "drawing") {
    return false
  }

  const boardObject = normalizeObject({
    ...interactionRef.current.preview,
  })

  editor.execute({
    type: "createBoardObject",
    boardObject,
  })

  interactionRef.current = {
    type: "idle",
  };

  return true
}