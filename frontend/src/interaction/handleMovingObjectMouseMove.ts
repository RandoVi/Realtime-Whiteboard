import type { MutableRefObject } from "react"

import type { Point } from "../types/Types"
import type { Interaction } from "./Interaction"

import { moveObject } from "../objects/moveObject";
import type { Object } from "../types/Object"
import type { Editor } from "../editor/Editor"
import type { Presence } from "../socket/preview/Presence"
import { getObjectMoveUpdates } from "./helpers/getObjectMoveUpdates";

type Args = {
  world: Point
  interactionRef: MutableRefObject<Interaction>
  getSelectedObject: () => Object | undefined
  editor: Editor
  presence: Presence
}
// Handles the mouse move event for an object that is being moved
export function handleMovingObjectMouseMove({
  world,
  interactionRef,
  getSelectedObject,
  editor,
  presence,
}: Args) {

  const interaction = interactionRef.current

  if (interaction.type !== "movingObject") {
    return false
  }

  const boardObject = getSelectedObject()

  if (!boardObject) {
    return false
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

  editor.execute(
    {
      type: "updateBoardObject",
      boardObjectId: boardObject.id,
      updates: getObjectMoveUpdates(movedObject),
    },
    {
      broadcast: false,
    }
  );
  // Send the updated position to other clients for preview
presence.send({
  type: "objectPreview",
  previewType: "update",
  boardObjectId: boardObject.id,
  updates: getObjectMoveUpdates(movedObject),
});


  return true
}