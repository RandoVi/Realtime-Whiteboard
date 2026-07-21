import type { MutableRefObject } from "react"
import type { Interaction } from "./Interaction"
import type { Shape } from "../types/Shape"

type Args = {
  interactionRef: MutableRefObject<Interaction>
  getSelectedShape: () => Shape | undefined
  
}

export function handleResizeMouseUp({
  interactionRef,
}: Args) {

  if (
    interactionRef.current.type !== "resizingShape"
  ) {
    return false
  }

  interactionRef.current = {
    type:"idle"
  }

  return true
}