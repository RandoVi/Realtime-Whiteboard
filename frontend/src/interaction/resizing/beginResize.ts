import type { MutableRefObject } from "react"
import type { Object } from "@common/types"
import type { Camera } from "../../types/Types"
import type { Point } from "@common/types";
import { getSelectionHandle } from "../../selection/getSelectionHandle"
import type { Interaction } from "../Interaction"
import { getSelectionBounds } from "../../selection/getSelectionBounds"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { updateCursor } from "../updateCursor"

type Args = {
  selectedObject: Object | undefined
  pointer: Point
  world: Point
  camera: Camera
  interactionRef: MutableRefObject<Interaction>
  context: CanvasInteractionContext;
}
// Handles the mouse down event for resizing a selected object
export function beginResize({
  selectedObject,
  pointer,
  world,
  camera,
  interactionRef,
  context,
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
    original: structuredClone(selectedObject),
    preview: structuredClone(selectedObject),
    handle,
    offset: {
        x: world.x - handlePosition.x,
        y: world.y - handlePosition.y,
    },
}

  updateCursor(context);

  return true
}