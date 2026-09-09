import type { RemotePresence } from "./RemotePresence";

export function isObjectSelectedByOtherUser(
  objectId: string,
  remotePresence: Map<string, RemotePresence>,
) {
  for (const presence of remotePresence.values()) {
    if (presence.selectedObjectIds.includes(objectId)) {
      return true;
    }
  }

  return false;
}