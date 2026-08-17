import type { RemotePresence } from "./RemotePresence";

export function isObjectSelectedByOtherUser(
    objectId: string,
    remotePresence: Map<string, RemotePresence>,
): boolean {
    for (const presence of remotePresence.values()) {
        if (presence.selectedObjectId === objectId) {
            return true;
        }
    }

    return false;
}