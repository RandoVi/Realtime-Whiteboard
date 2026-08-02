
import type { Point } from "../types/Types"

import { handleSelectionResizeMouseDown } from "./handleSelectionResizeMouseDown"
import { handleSelectionMoveMouseDown } from "./handleSelectionMoveMouseDown"
import { handleSelectionClearMouseDown } from "./handleSelectionClearMouseDown"
import type { CanvasInteractionContext } from "./CanvasInteractionContext"
import { getTopObjectAtPoint } from "../objects/getTopObjectAtPoint"

type Args = {
  pointer: Point
  world: Point
  context: CanvasInteractionContext
}


// Handles the mouse down event for selecting, moving, or resizing objects on the whiteboard
export function handleSelectionMouseDown({
  pointer,
  world,
  context,
}: Args) {

  const {
    document,
    cameraRef,
    interactionRef,
    getSelectedObject,
    selectObject,
    requestRender,
  } = context;

  const selectedObject = getSelectedObject();
  // Check if the user is trying to resize the selected object
  if (
    handleSelectionResizeMouseDown({
      selectedObject,
      pointer,
      world,
      camera: cameraRef.current,
      interactionRef,
    })
  ) {
    return true
  }


  const clickedObject = getTopObjectAtPoint(
    document.objectsRef.current,
    world,
  );
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
}