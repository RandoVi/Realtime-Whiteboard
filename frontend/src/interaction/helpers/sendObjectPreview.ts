import type { Presence } from "../../network/presence/Presence";

import type { InteractionObjectUpdate } from "../InteractionObjectUpdate";

type Args = {
  presence: Presence;
  objects: {
    objectId: string;
    updates: InteractionObjectUpdate;
  }[];
};

export function sendObjectPreview({
  presence,
  objects,
}: Args) {
  presence.send({
    type: "objectPreview",
    previewType: "update",
    objects: objects.map(object => ({
      boardObjectId: object.objectId,
      updates: object.updates,
    })),
  });
}