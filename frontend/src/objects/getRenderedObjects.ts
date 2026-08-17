import type { RemotePresence } from "../network/presence/RemotePresence";
import type { BoardObject } from "@common/types";
export function getRenderedObject(
    object: BoardObject,
    presence: RemotePresence
): BoardObject {
    if (
        presence.preview?.type === "update" &&
        presence.preview.objectId === object.id
    ) {
        return Object.assign(
            {},
            object,
            presence.preview.updates,
        );
    }

    return object;
}