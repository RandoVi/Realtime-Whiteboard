//move update.ts
import type { MutableRefObject } from "react"
import type { Point } from "../../types/Types"
import type { Interaction } from "../Interaction"
import { moveObject } from "../../objects/moveObject";
import type { Editor } from "../../editor/Editor"
import type { Presence } from "../../socket/preview/Presence"
import { getObjectMoveUpdates } from "../helpers/getObjectMoveUpdates";
import { getObjectById } from "../../objects/getObjectById";
import type { Document } from "../../document/Document";
import { updateObjectWithPreview } from "../helpers/updateObjectWithPreview";

type Args = {
  world: Point
  interactionRef: MutableRefObject<Interaction>
  document: Document
  editor: Editor
  presence: Presence
}
// Handles the mouse move event for an object that is being moved
export function handleMovingObjectMouseMove({
  world,
  interactionRef,
  document,
  editor,
  presence,
}: Args) {

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

  // Update the position of the shape based on the mouse movement
  const movedObject = {
    ...interaction.original,
  };

  moveObject(
    movedObject,
    interaction.original,
    dx,
    dy
  );

  updateObjectWithPreview({
    editor,
    presence,
    objectId: boardObject.id,
    updates: getObjectMoveUpdates(movedObject),
  });

  return true
}