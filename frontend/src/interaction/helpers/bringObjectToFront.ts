import type { BoardObject } from "@common/types";

type Args = {
  objects: BoardObject[];
  objectId: string;
};

export function bringObjectToFront({
  objects,
  objectId,
}: Args): void {

  const index = objects.findIndex(
    object => object.id === objectId
  );

  if (index === -1 || index === objects.length - 1) {
    return;
  }

  const [object] = objects.splice(index, 1);

  objects.push(object);
}