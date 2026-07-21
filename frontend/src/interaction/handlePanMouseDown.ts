import type { MutableRefObject } from "react"
import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"

type Args = {
  pointer: Point
  interactionRef: MutableRefObject<Interaction>
  canvas: HTMLCanvasElement
}

export function handlePanMouseDown({
  pointer,
  interactionRef,
  canvas,
}: Args) {
  interactionRef.current = {
    type: "panning",
    start: pointer,
  }

  canvas.style.cursor = "grabbing"
}