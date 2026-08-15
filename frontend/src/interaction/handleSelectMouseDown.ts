import type { Point } from "@common/types";
import { beginResize } from "./resizing/beginResize"
import { beginMoving } from "./moving/beginMoving"
import { handleSelectionClearMouseDown } from "./selection/clearSelection"
import type { CanvasInteractionContext } from "./CanvasInteractionContext"
import { getTopObjectAtPoint } from "../objects/getTopObjectAtPoint"
import { hitTestRotationHandle } from "../selection/hitTestRotationHandle";
import { isRotatableObject } from "../objects/isRotatableObject";

type Args = {
  pointer: Point
  world: Point
  context: CanvasInteractionContext
}


// Handles the mouse down event for selecting, moving, or resizing objects on the whiteboard
export function handleSelectMouseDown({
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

  // Check if the user is trying to rotate the selected object
  if (
    selectedObject &&
    isRotatableObject(selectedObject) &&
    hitTestRotationHandle(
      selectedObject,
      pointer,
      cameraRef.current,
    )
  ) {
    interactionRef.current = {
      type: "rotating",
      objectId: selectedObject.id,
      original: structuredClone(selectedObject),
      preview: structuredClone(selectedObject),
    }

    return true
  }

  // Check if the user is trying to resize the selected object
  if (
    beginResize({
      selectedObject,
      pointer,
      world,
      camera: cameraRef.current,
      interactionRef,
      context,
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
    beginMoving({
      clickedObject,
      world,
      interactionRef,
      selectObject,
      requestRender,
      context,
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