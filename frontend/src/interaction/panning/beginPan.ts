
import type { Point } from "../../types/Types"

import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { updateCursor } from "../updateCursor";

type Args = {
  pointer: Point;
  canvas: HTMLCanvasElement;
  context: CanvasInteractionContext;
}

// Handle the mouse down event when starting to pan the canvas
export function beginPan({
  pointer,
  context,
}: Args) {
    context.interactionRef.current = {
    type: "panning",
    start: pointer,
  }

  updateCursor(context);
}