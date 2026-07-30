import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import { normalizeShape } from "../shapes/normalizeShape"
import type { Editor } from "../editor/Editor"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  editor: Editor
}

export function handleDrawingMouseUp({
  interactionRef,
  editor
}: Args): boolean {
  if (interactionRef.current.type !== "drawingShape") {
    return false
  }

  const boardObject = normalizeShape({
    ...interactionRef.current.preview,
  })

  editor.execute({
    type: "createBoardObject",
    boardObject,
  })

  return true
}