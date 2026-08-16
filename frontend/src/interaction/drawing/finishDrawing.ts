import { normalizeObject } from "../../objects/normalizeObject"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { clearObjectPreview } from "../clearObjectPreview"

type Args = {
  context: CanvasInteractionContext
}
// Handles the mouse up event when drawing a object
export function finishDrawing({
  context
}: Args): boolean {
  const { interactionRef, editor, selectObject, presence } = context
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

  clearObjectPreview({
    presence,
  })

  selectObject(boardObject.id)

  interactionRef.current = {
    type: "idle",
  };

  return true
}