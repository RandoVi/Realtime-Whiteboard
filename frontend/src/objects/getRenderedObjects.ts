import type { RemotePresence } from "../network/presence/RemotePresence";
import type { BoardObject } from "@common/types";

export function getRenderedObject(
    object: BoardObject,
    presence: RemotePresence
): BoardObject {
    const preview = presence.previews.find(
        preview =>
            preview.type === "update" &&
            preview.objectId === object.id
    );

    if (!preview || preview.type !== "update") {
        return object;
    }

    return Object.assign(
        {},
        object,
        preview.updates,
    );
}