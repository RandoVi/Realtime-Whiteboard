import type { MutableRefObject } from "react";

type Args = {
  selectObject: (id: string | null) => void;
  requestRender: () => void;
  selectedObjectIdsRef: MutableRefObject<string[]>;
  setSelectedObjectIds: (ids: string[]) => void;
};

// Handles the mouse down event for clearing the selection of objects on the whiteboard
export function handleSelectionClearMouseDown({
  selectObject,
  requestRender,
  selectedObjectIdsRef,
  setSelectedObjectIds,
}: Args) {
  selectedObjectIdsRef.current = [];
  setSelectedObjectIds([]);

  selectObject(null);

  requestRender();
}