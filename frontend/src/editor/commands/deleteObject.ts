import type { Object } from "../../types/Object";

type Args = {
  objects: Object[];
  objectId: string;
};

export function deleteObject({
  objects,
  objectId,
}: Args) {

  const index = objects.findIndex(
    object => object.id === objectId
  );

  if (index === -1) {
    return;
  }

  objects.splice(index, 1);
}