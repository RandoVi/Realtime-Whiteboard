//resize finish.ts
import type { MutableRefObject } from "react"
import type { Interaction } from "../Interaction"

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