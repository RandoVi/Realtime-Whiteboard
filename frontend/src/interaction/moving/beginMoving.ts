import type { MutableRefObject } from "react"
import type { BoardObject } from "@common/types"
import type { Point } from "@common/types"
import type { Interaction } from "../Interaction"
import { updateCursor } from "../updateCursor"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { getObjectById } from "../../objects/getObjectById"

type Args = {
  clickedObject: BoardObject | undefined
  world: Point
  interactionRef: MutableRefObject<Interaction>
  selectObject: (id: string | null) => void
  requestRender: () => void
  context: CanvasInteractionContext;
}
// Handles the mouse down event when moving a selected object
export function beginMoving({
  clickedObject,
  world,
  interactionRef,
  selectObject,
  requestRender,
  context,
}: Args): boolean {
  if (!clickedObject) {
    return false;
  }

  const {
    document,
    selectedObjectIdsRef,
    editor,
  } = context;

  const selectedIds = selectedObjectIdsRef.current;

  const isAlreadySelected =
    selectedIds.includes(clickedObject.id);

  const objectIds = isAlreadySelected
    ? selectedIds
    : [clickedObject.id];

  if (!isAlreadySelected) {
    selectedObjectIdsRef.current = [clickedObject.id];
    context.setSelectedObjectIds([clickedObject.id]);

    selectObject(clickedObject.id);
  }

  for (const objectId of objectIds) {
    editor.execute({
      type: "bringBoardObjectToFront",
      boardObjectId: objectId,
    });
  }

  const original = objectIds
    .map(id =>
      getObjectById(
        document.objectsRef.current,
        id,
      )
    )
    .filter(
      (object): object is BoardObject =>
        object !== undefined
    );

  const preview = original.map(object =>
    structuredClone(object)
  );

  interactionRef.current = {
    type: "moving",
    start: world,
    original,
    preview,
    objectIds: original.map(object => object.id),
    moved: false,
  };

  updateCursor(context);
  requestRender();

  return true;
}