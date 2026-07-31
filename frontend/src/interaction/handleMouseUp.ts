import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import type { Shape } from "../types/Shape"
import { handleDrawingMouseUp } from "./handleDrawingMouseUp"
import { handleResizeMouseUp } from "./handleResizeMouseUp"
import type { Editor } from "../editor/Editor"
import { handleMovingShapeMouseUp } from "./handleMovingShapeMouseUp"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  editor: Editor
  getSelectedShape: () => Shape | undefined

}
// Handles the mouse up event for various interactions like drawing, moving, and resizing shapes
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
    handleMovingShapeMouseUp({
      interactionRef,
      getSelectedShape,
      editor,
    })
  ) {
    return;
  }

  if (
    handleResizeMouseUp({
      interactionRef,
      getSelectedShape,
      editor,
    })
  ) {
    return
  }
}