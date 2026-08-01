import type { MutableRefObject } from "react"
import type { Object } from "../types/Object"
import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"

type Args = {
  clickedObject: Object | undefined
  world: Point
  interactionRef: MutableRefObject<Interaction>
  selectObject: (id: string | null) => void
  requestRender: () => void
}
// Handles the mouse down event when moving a selected object
export function handleSelectionMoveMouseDown({
  clickedObject,
  world,
  interactionRef,
  selectObject,
  requestRender,
}: Args): boolean {
  if (!clickedObject) {
    return false
  }

  selectObject(clickedObject.id)

  interactionRef.current = {
    type: "movingObject",
    start: world,
    original: { ...clickedObject },
    objectId: clickedObject.id,
    moved: false,
  }

  requestRender()

  return true
}