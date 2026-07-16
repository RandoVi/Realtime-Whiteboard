import type { MutableRefObject } from "react"
import type { Shape } from "../../shapes/Shape"
import type { Camera, Point } from "../../Types"
import { getSelectionHandle } from "./getSelectionHandle"
import type { Interaction } from "../../interaction/Interaction"

type Args = {
  selectedShape: Shape | undefined
  pointer: Point
  camera: Camera
  interactionRef: MutableRefObject<Interaction>
}

export function handleSelectionResizeMouseDown({
  selectedShape,
  pointer,
  camera,
  interactionRef,
}: Args): boolean {
  if (!selectedShape) {
    return false
  }

  const handle = getSelectionHandle(
    selectedShape,
    pointer,
    camera,
  )

  if (!handle) {
    return false
  }

  interactionRef.current = {
    type: "resizingShape",
    shapeId: selectedShape.id,
    original: { ...selectedShape },
    handle,
  }

  return true
}