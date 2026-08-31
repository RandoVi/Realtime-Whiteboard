import type { Point } from "@common/types";
import { screenToWorld, type Camera } from "../../camera/Camera";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { handleMouseMove } from "../handlers/handleMouseMove";

type Args = {
  pointer: Point;
  camera: Camera;
  context: CanvasInteractionContext;
  constrain: boolean;
};

export function updateInteractionAtCurrentPointer({
  pointer,
  camera,
  context,
  constrain,
}: Args) {
  const world = screenToWorld(pointer, camera);

  handleMouseMove({
    pointer,
    world,
    context,
    constrain,
  });
}