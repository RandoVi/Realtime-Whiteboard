import type { MutableRefObject } from "react"
import type { Camera, Point } from "../types/Types"
import type { Object } from "../types/Object"
import type { Interaction } from "./Interaction"

import { hitTestObject } from "../objects/hitTest"
import { handleSelectionResizeMouseDown } from "./handleSelectionResizeMouseDown"
import { handleSelectionMoveMouseDown } from "../../../../handleSelectionMoveMouseDown"
import { handleSelectionClearMouseDown } from "./handleSelectionClearMouseDown"

type Args = {
  pointer: Point
  world: Point

  objects: Object[]
  camera: Camera

  getSelectedObject: () => Object | undefined
  selectObject: (id: string | null) => void

  interactionRef: MutableRefObject<Interaction>
  requestRender: () => void
}
// Handles the mouse down event for selecting, moving, or resizing objects on the whiteboard
export function handleSelectionMouseDown({
  pointer,
  world,
  objects,
  camera,
  getSelectedObject,
  selectObject,
  interactionRef,
  requestRender,
}: Args): boolean {
  // Check if the user is trying to resize the selected object
  if (
    handleSelectionResizeMouseDown({
      selectedObject: getSelectedObject(),
      pointer,
      camera,
      interactionRef,
    })
  ) {
    return true
  }

  const clickedObject = objects
    .slice()
    .reverse()
    .find(object => hitTestObject(world, object))
  // If the user clicked on a object, select it and start moving it
  if (
    handleSelectionMoveMouseDown({
      clickedObject,
      world,
      interactionRef,
      selectObject,
      requestRender,
    })
  ) {
    return true
  }
  // If the user clicked on an empty area, clear the selection
  handleSelectionClearMouseDown({
    selectObject,
    requestRender,
  })

  return true
}