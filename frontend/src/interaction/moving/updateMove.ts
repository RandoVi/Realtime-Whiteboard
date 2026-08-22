
import type { Point } from "@common/types";
import { moveObject } from "../../objects/moveObject";
import { getObjectMoveUpdates } from "../helpers/getObjectMoveUpdates";
import { getObjectById } from "../../objects/getObjectById";
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
    document,
    presence,
    requestRender,
  } = context;

  const interaction = interactionRef.current

  if (interaction.type !== "moving") {
    return false
  }

  const boardObject = getObjectById(
    document.objectsRef.current,
    interaction.objectId
  );

  if (!boardObject) {
    return false;
  }

  const dx =
    world.x - interaction.start.x

  const dy =
    world.y - interaction.start.y
  //just to avoid unnecessary updates when the mouse is moved a little bit(jitter)
  if (!interaction.moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
    interaction.moved = true;
  }

  moveObject(
    interaction.preview,
    interaction.original,
    dx,
    dy,
);
// console.log(
//   "LOCAL PREVIEW",
//   interaction.preview
// );

  sendObjectPreview({
    presence,
    objectId: boardObject.id,
    updates: getObjectMoveUpdates(interaction.preview),
  });

  requestRender();

return true;
}