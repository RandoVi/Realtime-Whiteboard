import type { RemotePresence } from "./RemotePresence";
import { createRemotePresence } from "./createRemotePresence";

export function getOrCreateRemotePresence(
    remotePresence: Map<string, RemotePresence>,
    userId: string,
): RemotePresence {
    const existingPresence = remotePresence.get(userId);

    if (existingPresence) {
        return existingPresence;
    }

    const newPresence = createRemotePresence();

    remotePresence.set(userId, newPresence);

    return newPresence;
}