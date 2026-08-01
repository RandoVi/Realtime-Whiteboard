import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import type { Object } from "../types/Object"
import type { Editor } from "../editor/Editor"
import { getObjectResizeUpdates } from "./helpers/getObjectResizeUpdates"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  getSelectedObject: () => Object | undefined
  editor: Editor;
}
// Handles the mouse up event for resizing a object
export function handleResizeMouseUp({
  interactionRef,
  getSelectedObject,
  editor,
}: Args) {

  if (
    interactionRef.current.type !== "resizingObject"
  ) {
    return false
  }
  const object = getSelectedObject();

  if (!object) {
    return false;
  }
  // Finalize the resize operation and update the object's size and position in the editor
  editor.execute({
    type: "updateBoardObject",
    boardObjectId: object.id,
    updates: getObjectResizeUpdates(object),
  });
  // Reset the interaction state to idle after resizing is complete
  interactionRef.current = {
    type: "idle",
  };

  return true;
}