
import type { Presence } from "../../socket/preview/Presence";
import type { ObjectUpdate } from "../../types/ObjectUpdate";

type Args = {
    presence: Presence;
    objectId: string;
    updates: ObjectUpdate;
};

export function sendObjectPreview({
    presence,
    objectId,
    updates,
}: Args) {

    presence.send({
        type: "objectPreview",
        previewType: "update",
        boardObjectId: objectId,
        updates,
    });
}