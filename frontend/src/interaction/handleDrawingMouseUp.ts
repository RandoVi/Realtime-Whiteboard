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

  const shape = normalizeShape({
    ...interactionRef.current.preview,
  })

  editor.execute({
    type: "createShape",
    shape,
  })

  return true
}