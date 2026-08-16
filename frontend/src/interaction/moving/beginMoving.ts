import type { MutableRefObject } from "react"
import type { Object } from "@common/types"
import type { Point } from "@common/types"
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

  context.editor.execute({
    type: "bringBoardObjectToFront",
    boardObjectId: clickedObject.id,
  })

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