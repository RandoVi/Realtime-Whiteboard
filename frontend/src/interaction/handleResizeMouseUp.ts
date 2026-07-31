import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import type { Shape } from "../types/Shape"
import type { Editor } from "../editor/Editor"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  getSelectedShape: () => Shape | undefined
  editor: Editor;
}
// Handles the mouse up event for resizing a shape
export function handleResizeMouseUp({
  interactionRef,
  getSelectedShape,
  editor,
}: Args) {

  if (
    interactionRef.current.type !== "resizingShape"
  ) {
    return false
  }
  const shape = getSelectedShape();

  if (!shape) {
    return false;
  }
  // Finalize the resize operation and update the shape's size and position in the editor
  editor.execute({
    type: "updateBoardObject",
    boardObjectId: shape.id,
    updates: {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
    },
  });
  // Reset the interaction state to idle after resizing is complete
  interactionRef.current = {
    type: "idle",
  };

  return true;
}