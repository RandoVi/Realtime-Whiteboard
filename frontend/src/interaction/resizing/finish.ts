import type { MutableRefObject } from "react"
import type { Interaction } from "../Interaction"
import type { Object } from "../../types/Object"
import type { Editor } from "../../editor/Editor"
import { getObjectResizeUpdates } from "../helpers/getObjectResizeUpdates"
import type {Document} from "../../document/Document"

type Args = {
  interactionRef: MutableRefObject<Interaction>

}
// Handles the mouse up event for resizing a object
export function handleResizeMouseUp({
  interactionRef,
}: Args): boolean  {

  if (
    interactionRef.current.type !== "resizing"
  ) {
    return false
  }
  
  // Reset the interaction state to idle after resizing is complete
  interactionRef.current = {
    type: "idle",
  };

  return true;
}