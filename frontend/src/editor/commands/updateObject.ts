import type { BoardObject } from "@common/types";
import { getObjectById } from "../../objects/getObjectById";

type Args = {
  objects: BoardObject[];
  objectId: string;
  updates: Partial<BoardObject>;
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