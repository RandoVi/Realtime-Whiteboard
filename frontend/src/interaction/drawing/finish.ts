import type { MutableRefObject } from "react"
import type { Interaction } from "../Interaction"
import { normalizeObject } from "../../objects/normalizeObject"
import type { Editor } from "../../editor/Editor"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  editor: Editor
}
// Handles the mouse up event when drawing a object
export function handleDrawingMouseUp({
  interactionRef,
  editor
}: Args): boolean {
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