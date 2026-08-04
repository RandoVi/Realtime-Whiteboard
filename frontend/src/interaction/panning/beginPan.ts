
import type { Point } from "../../types/Types"

import type { CanvasInteractionContext } from "../CanvasInteractionContext";

type Args = {
  pointer: Point;
  canvas: HTMLCanvasElement;
  context: CanvasInteractionContext;
}

// Handle the mouse down event when starting to pan the canvas
export function handlePanMouseDown({
  pointer,
  canvas,
  context,
}: Args) {
    context.interactionRef.current = {
    type: "panning",
    start: pointer,
  }

  canvas.style.cursor = "grabbing"
}