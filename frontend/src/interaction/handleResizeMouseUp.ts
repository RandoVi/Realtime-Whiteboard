import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import type { Shape } from "../types/Shape"
import type { Editor } from "../editor/Editor"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  getSelectedShape: () => Shape | undefined
  editor: Editor;
}

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

  interactionRef.current = {
    type: "idle",
  };

  return true;
}