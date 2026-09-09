import type { MutableRefObject } from "react"
import type { RotatableObject } from "@common/types"
import type { Interaction } from "../Interaction"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"

type Args = {
  object: RotatableObject
  interactionRef: MutableRefObject<Interaction>
  context: CanvasInteractionContext
}

export function beginRotation({
  object,
  interactionRef,
  context,
}: Args): boolean {

  context.editor.execute({
    type: "bringBoardObjectToFront",
    boardObjectId: object.id,
  })

  interactionRef.current = {
    type: "rotating",
    objectId: object.id,
    original: structuredClone(object),
    preview: structuredClone(object),
  }

  context.requestRender()

  return true
}