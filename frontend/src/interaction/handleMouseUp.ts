import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import type { Object } from "../types/Object"
import { handleDrawingMouseUp } from "./handleDrawingMouseUp"
import { handleResizeMouseUp } from "./handleResizeMouseUp"
import type { Editor } from "../editor/Editor"
import { handleMovingObjectMouseUp } from "./handleMovingObjectMouseUp"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  editor: Editor
  getSelectedObject: () => Object | undefined

}
// Handles the mouse up event for various interactions like drawing, moving, and resizing objects
export function handleMouseUp({
  interactionRef,
  getSelectedObject,
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
    handleMovingObjectMouseUp({
      interactionRef,
      getSelectedObject,
      editor,
    })
  ) {
    return;
  }

  if (
    handleResizeMouseUp({
      interactionRef,
      getSelectedObject,
      editor,
    })
  ) {
    return
  }
}