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

  handleSelectionClearMouseDown({
    selectShape,
    requestRender,
  })

  return true
}