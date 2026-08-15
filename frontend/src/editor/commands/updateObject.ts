import type { Object } from "@common/types";
import { getObjectById } from "../../objects/getObjectById";

type Args = {
  objects: Object[];
  objectId: string;
  updates: Partial<Object>;
};

export function updateObject({
  objects,
  objectId,
  updates,
}: Args) {
  const object = getObjectById(
    objects,
    objectId
  );

  if (!object) {
    return;
  }

  Object.assign(
    object,
    updates
  );
}