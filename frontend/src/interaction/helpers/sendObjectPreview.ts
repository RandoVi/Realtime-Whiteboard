
import type { Presence } from "../../network/presence/Presence";
import type { InteractionObjectUpdate } from "../InteractionObjectUpdate";

type Args = {
    presence: Presence;
    objectId: string;
    updates: InteractionObjectUpdate;
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