import type { RemotePresence } from "../socket/preview/RemotePresence";
import type { Object } from "../types/Object";

export function getRenderedObject(
    object: Object,
    presence: RemotePresence
): Object {
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