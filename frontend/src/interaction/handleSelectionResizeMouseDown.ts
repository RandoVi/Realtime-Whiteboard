import type { MutableRefObject } from "react"
import type { Object } from "../types/Object"
import type { Camera, Point } from "../types/Types"
import { getSelectionHandle } from "../selection/getSelectionHandle"
import type { Interaction } from "./Interaction"

type Args = {
  selectedObject: Object | undefined
  pointer: Point
  camera: Camera
  interactionRef: MutableRefObject<Interaction>
}
// Handles the mouse down event for resizing a selected object
export function handleSelectionResizeMouseDown({
  selectedObject,
  pointer,
  camera,
  interactionRef,
}: Args): boolean {
  if (!selectedObject) {
    return false
  }

  const handle = getSelectionHandle(
    selectedObject,
    pointer,
    camera,
  )

  if (!handle) {
    return false
  }

  interactionRef.current = {
    type: "resizingObject",
    objectId: selectedObject.id,
    original: { ...selectedObject },
    handle,
  }

  return true
}