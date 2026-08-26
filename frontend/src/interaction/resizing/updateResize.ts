import { resizeObject } from "../../objects/resizeObject"
import type { Point } from "@common/types";
import { getObjectById } from "../../objects/getObjectById"
import { sendObjectPreview } from "../helpers/sendObjectPreview"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { getObjectMoveUpdates } from "../helpers/getObjectMoveUpdates";

type Args = {
  world: Point
  context: CanvasInteractionContext
  constrain: boolean
}

export function updateResize({
  world,
  context,
  constrain,
}: Args): boolean {

  const {
    interactionRef,
    document,
    presence,
    requestRender,
  } = context;

  if (interactionRef.current.type !== "resizing") {
    return false;
  }

  const interaction = interactionRef.current;

  const resizePoint = {
    x: world.x - interaction.offset.x,
    y: world.y - interaction.offset.y,
  };

  resizeObject(
    interaction.preview,
    interaction.original,
    interaction.handle,
    resizePoint,
    constrain,
  );

  const boardObject = getObjectById(
    document.objectsRef.current,
    interaction.objectId,
  );

  if (!boardObject) {
    return false;
  }

  sendObjectPreview({
    presence,
    objects: [
      {
        objectId: boardObject.id,
        updates: getObjectMoveUpdates(boardObject),
      },
    ],
  });

  requestRender();

  return true;
}