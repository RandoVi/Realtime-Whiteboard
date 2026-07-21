import type { MutableRefObject } from "react"
import type { Shape } from "../types/Shape"
import type { Camera, Point } from "../types/Types"
import type { Interaction } from "./Interaction"

type Args = {
  clickedShape: Shape | undefined
  world: Point
  interactionRef: MutableRefObject<Interaction>
  selectShape: (id: string | null) => void
  requestRender: () => void
}

export function handleSelectionMoveMouseDown({
  clickedShape,
  world,
  interactionRef,
  selectShape,
  requestRender,
}: Args): boolean {
  if (!clickedShape) {
    return false
  }

  selectShape(clickedShape.id)

  interactionRef.current = {
    type: "movingShape",
    start: world,
    original: { ...clickedShape },
    shapeId: clickedShape.id,
  }

  requestRender()

  return true
}