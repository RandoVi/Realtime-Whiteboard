import type { BoardObject } from "@common/types";

type Args = {
  objects: BoardObject[];
  objectIds: string[];
};

export function bringObjectsToFront({
  objects,
  objectIds,
}: Args): void {
  if (objectIds.length === 0) {
    return;
  }

  const selectedIds = new Set(objectIds);

  const selectedObjects: BoardObject[] = [];
  const remainingObjects: BoardObject[] = [];

  for (const object of objects) {
    if (selectedIds.has(object.id)) {
      selectedObjects.push(object);
    } else {
      remainingObjects.push(object);
    }
  }

  objects.length = 0;
  objects.push(
    ...remainingObjects,
    ...selectedObjects
  );
}