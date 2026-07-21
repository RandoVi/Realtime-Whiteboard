import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import type { Shape } from "../types/Shape"
import { handleDrawingMouseUp } from "./handleDrawingMouseUp"
import { handleResizeMouseUp } from "./handleResizeMouseUp"
import type { Editor } from "../editor/Editor"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  editor: Editor
  getSelectedShape: () => Shape | undefined
  
}

export function handleMouseUp({
  interactionRef,
  getSelectedShape,
  editor,
  
}: Args) {

  if (
    handleDrawingMouseUp({
      interactionRef,
      editor,
    })
  ) {
    return
  }

  if (
    handleResizeMouseUp({
      interactionRef,
      getSelectedShape,
    })
  ) {
    return
  }
}