import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
  context: CanvasInteractionContext

}
// Handles the mouse up event for resizing a object
export function handleResizeMouseUp({
  context
}: Args): boolean  {

  const { interactionRef } = context;

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