import type { MutableRefObject } from "react"
import type { BoardObject } from "@common/types"
import type { Camera } from "../../camera/Camera"
import type { Point } from "@common/types"
import { getSelectionHandle } from "../selection/getSelectionHandle"
import type { Interaction } from "../Interaction"
import { getSelectionBounds } from "../selection/getSelectionBounds"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { updateCursor } from "../updateCursor"
import { screenToWorld } from "../../camera/Camera"
import { getResizeHandles } from "../selection/getResizeHandles"
import { getObjectHandler } from "../../objects/registry/getObjectHandler"

type Args = {
  selectedObject: BoardObject | undefined
  pointer: Point
  world: Point
  camera: Camera
  interactionRef: MutableRefObject<Interaction>
  context: CanvasInteractionContext
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

  const handler =
    getObjectHandler(selectedObject)

  const handles = getResizeHandles(
    bounds,
    camera,
    handler.resizeHandles,
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

  // Only change z-order once we know
  // that an actual resize is starting.
  context.editor.execute({
    type: "bringBoardObjectToFront",
    boardObjectId: selectedObject.id,
  })

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

  updateCursor(context)

  return true
}