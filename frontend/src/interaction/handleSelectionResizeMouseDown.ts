import type { MutableRefObject } from "react"
import type { Object } from "../types/Object"
import type { Camera, Point } from "../types/Types"
import { getSelectionHandle } from "../selection/getSelectionHandle"
import type { Interaction } from "./Interaction"
import { getSelectionBounds } from "../selection/getSelectionBounds"

type Args = {
  selectedObject: Object | undefined
  pointer: Point
  world: Point
  camera: Camera
  interactionRef: MutableRefObject<Interaction>
}
// Handles the mouse down event for resizing a selected object
export function handleSelectionResizeMouseDown({
  selectedObject,
  pointer,
  world,
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

  const bounds = getSelectionBounds(selectedObject)

  const handlePosition = {
    nw: {
      x: bounds.left,
      y: bounds.top,
    },
    ne: {
      x: bounds.right,
      y: bounds.top,
    },
    sw: {
      x: bounds.left,
      y: bounds.bottom,
    },
    se: {
      x: bounds.right,
      y: bounds.bottom,
    },
  }[handle]

  if (!handlePosition) {
    return false
  }

  interactionRef.current = {
    type: "resizing",
    objectId: selectedObject.id,
    original: { ...selectedObject },
    handle,
    offset: {
      x: world.x - handlePosition.x,
      y: world.y - handlePosition.y,
    },
  }

  return true
}