import type { Point } from "@common/types";
import { beginResize } from "../resizing/beginResize"
import { beginMoving } from "../moving/beginMoving"
import type { CanvasInteractionContext } from "../CanvasInteractionContext"
import { getTopObjectAtPoint } from "../../objects/getTopObjectAtPoint"
import { hitTestRotationHandle } from "../selection/hitTestRotationHandle";
import { isRotatableObject } from "../../objects/isRotatableObject";
import { beginRotation } from "../rotation/beginRotation";
// import { handleSelectionClearMouseDown } from "../selection/handleSelectionClearMouseDown";

type Args = {
  pointer: Point
  world: Point
  context: CanvasInteractionContext
  multiSelect: boolean;
}


// Handles the mouse down event for selecting, moving, or resizing objects on the whiteboard
export function handleSelectMouseDown({
  pointer,
  world,
  context,
  multiSelect,
}: Args) {

  const {
    document,
    cameraRef,
    interactionRef,
    getSelectedObject,
    selectObject,
    requestRender,
    selectedObjectIdRef,
    setSelectedObjectId,
    selectedObjectIdsRef,
    setSelectedObjectIds,
  } = context;

  const selectedObject = getSelectedObject();

  // Check if the user is trying to rotate the selected object
  if (
    selectedObject &&
    isRotatableObject(selectedObject) &&
    hitTestRotationHandle(
      selectedObject,
      pointer,
      cameraRef.current,
    )
  ) {
    return beginRotation({
      object: selectedObject,
      interactionRef,
      context,
    });
  }

  // Check if the user is trying to resize the selected object
  if (
    beginResize({
      selectedObject,
      pointer,
      world,
      camera: cameraRef.current,
      interactionRef,
      context,
    })
  ) {
    return true;
  }

  const clickedObject = getTopObjectAtPoint(
    document.objectsRef.current,
    world,
  );

  if (!clickedObject) {
    // Clear the current selection immediately.
    selectedObjectIdsRef.current = [];
    setSelectedObjectIds([]);

    selectedObjectIdRef.current = null;
    setSelectedObjectId(null);

    interactionRef.current = {
      type: "selecting",
      start: world,
      current: world,
    };

    requestRender();
    return true;
  }

  // Multi-select
  // Multi-select
  if (multiSelect && clickedObject) {
    const selectedIds = selectedObjectIdsRef.current;

    if (selectedIds.includes(clickedObject.id)) {
      const nextSelectedIds = selectedIds.filter(
        id => id !== clickedObject.id
      );

      selectedObjectIdsRef.current = nextSelectedIds;
      setSelectedObjectIds(nextSelectedIds);

      if (selectedObjectIdRef.current === clickedObject.id) {
        selectedObjectIdRef.current =
          nextSelectedIds[0] ?? null;

        setSelectedObjectId(
          nextSelectedIds[0] ?? null
        );
      }
    } else {
      const nextSelectedIds = [
        ...selectedIds,
        clickedObject.id,
      ];

      selectedObjectIdsRef.current = nextSelectedIds;
      setSelectedObjectIds(nextSelectedIds);

      selectedObjectIdRef.current = clickedObject.id;
      setSelectedObjectId(clickedObject.id);
    }

    requestRender();
    return;
  }

  // Existing single-selection behavior
  if (
    beginMoving({
      clickedObject,
      world,
      interactionRef,
      selectObject,
      requestRender,
      context,
    })
  ) {
    return true;
  }
}