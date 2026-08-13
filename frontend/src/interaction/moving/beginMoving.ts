import type { MutableRefObject } from "react"
import type { Object } from "../../types/Object"
import type { Point } from "../../types/Types"
import type { Interaction } from "../Interaction"
import { updateCursor } from "../updateCursor"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
  clickedObject: Object | undefined
  world: Point
  interactionRef: MutableRefObject<Interaction>
  selectObject: (id: string | null) => void
  requestRender: () => void
  context: CanvasInteractionContext;
}
// Handles the mouse down event when moving a selected object
export function beginMoving({
  clickedObject,
  world,
  interactionRef,
  selectObject,
  requestRender,
  context,
}: Args): boolean {
  if (!clickedObject) {
    return false
  }

  selectObject(clickedObject.id)
  
  interactionRef.current = {
    type: "moving",
    start: world,
    original: clickedObject,
    preview: structuredClone(clickedObject),
    objectId: clickedObject.id,
    moved: false,
  };

  updateCursor(context);
  requestRender()

  return true
}