import type { MutableRefObject } from "react"
import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"

type Args = {
  pointer: Point
  interactionRef: MutableRefObject<Interaction>
  canvas: HTMLCanvasElement
}
// Handle the mouse down event when starting to pan the canvas
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