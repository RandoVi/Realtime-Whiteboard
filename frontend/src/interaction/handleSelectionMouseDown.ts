import type { MutableRefObject } from "react"
import type { Camera, Point } from "../types/Types"
import type { Shape } from "../types/Shape"
import type { Interaction } from "./Interaction"

import { hitTestShape } from "../shapes/hitTest"
import { handleSelectionResizeMouseDown } from "./handleSelectionResizeMouseDown"
import { handleSelectionMoveMouseDown } from "./handleSelectionMoveMouseDown"
import { handleSelectionClearMouseDown } from "./handleSelectionClearMouseDown"

type Args = {
  pointer: Point
  world: Point

  shapes: Shape[]
  camera: Camera

  getSelectedShape: () => Shape | undefined
  selectShape: (id: string | null) => void

  interactionRef: MutableRefObject<Interaction>
  requestRender: () => void
}
// Handles the mouse down event for selecting, moving, or resizing shapes on the whiteboard
export function handleSelectionMouseDown({
  pointer,
  world,
  shapes,
  camera,
  getSelectedShape,
  selectShape,
  interactionRef,
  requestRender,
}: Args): boolean {
  // Check if the user is trying to resize the selected shape
  if (
    handleSelectionResizeMouseDown({
      selectedShape: getSelectedShape(),
      pointer,
      camera,
      interactionRef,
    })
  ) {
    return true
  }

  const clickedShape = shapes
    .slice()
    .reverse()
    .find(shape => hitTestShape(world, shape))
  // If the user clicked on a shape, select it and start moving it
  if (
    handleSelectionMoveMouseDown({
      clickedShape,
      world,
      interactionRef,
      selectShape,
      requestRender,
    })
  ) {
    return true
  }
  // If the user clicked on an empty area, clear the selection
  handleSelectionClearMouseDown({
    selectShape,
    requestRender,
  })

  return true
}