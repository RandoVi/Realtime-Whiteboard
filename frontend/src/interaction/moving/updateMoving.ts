
import type { Point } from "@common/types";
import { moveObject } from "../../objects/moveObject";
import { getObjectMoveUpdates } from "../helpers/getObjectMoveUpdates";
import { sendObjectPreview } from "../helpers/sendObjectPreview";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";

type Args = {
  world: Point;
  context: CanvasInteractionContext;
}
// Handles the mouse move event for an object that is being moved
export function updateMoving({
  world,
  context,
}: Args) {
  const {
    interactionRef,
    presence,
    requestRender,
  } = context;

  const interaction = interactionRef.current;

  if (interaction.type !== "moving") {
    return false;
  }

  const dx = world.x - interaction.start.x;
  const dy = world.y - interaction.start.y;

  if (
    !interaction.moved &&
    (Math.abs(dx) > 2 || Math.abs(dy) > 2)
  ) {
    interaction.moved = true;
  }

  if (!interaction.moved) {
    requestRender();
    return true;
  }

  const previewUpdates = [];

  for (let i = 0; i < interaction.preview.length; i++) {
    const object = interaction.preview[i];

    moveObject(
      object,
      interaction.original[i],
      dx,
      dy,
    );

    previewUpdates.push({
      objectId: object.id,
      updates: getObjectMoveUpdates(object),
    });
  }

  sendObjectPreview({
    presence,
    objects: previewUpdates,
  });

  requestRender();

  return true;
}