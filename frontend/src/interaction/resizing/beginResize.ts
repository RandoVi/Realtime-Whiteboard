import type { MutableRefObject } from "react"
import type { Object } from "@common/types"
import type { Camera } from "../../types/Types"
import type { Point } from "@common/types";
import { getSelectionHandle } from "../../selection/getSelectionHandle"
import type { Interaction } from "../Interaction"
import { getSelectionBounds } from "../../selection/getSelectionBounds"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { updateCursor } from "../updateCursor"
import { screenToWorld } from "../../camera/Camera";
import { getResizeHandles } from "../../selection/getResizeHandles";

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

  context.editor.execute({
    type: "bringBoardObjectToFront",
    boardObjectId: selectedObject.id,
  })

  const handle = getSelectionHandle(
    selectedObject,
    pointer,
    camera,
  )

  if (!handle) {
    return false
  }

  const bounds = getSelectionBounds(selectedObject)

  const handles = getResizeHandles(
    bounds,
    camera,
  )

  const handleScreenPosition = handles.find(
    item => item.type === handle
  )

  if (!handleScreenPosition) {
    return false
  }

  const handlePosition = screenToWorld(
    {
      x: handleScreenPosition.x,
      y: handleScreenPosition.y,
    },
    camera,
  )

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