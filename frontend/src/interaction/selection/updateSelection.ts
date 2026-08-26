import type { Point } from "@common/types";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";

type Args = {
  world: Point;
  context: CanvasInteractionContext;
};

export function updateSelection({
  world,
  context,
}: Args) {
  const interaction = context.interactionRef.current;

  if (interaction.type !== "selecting") {
    return;
  }

  interaction.current = world;

  context.requestRender();
}