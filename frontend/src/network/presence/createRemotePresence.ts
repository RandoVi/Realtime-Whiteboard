import type { RemotePresence } from "./RemotePresence";

export function createRemotePresence(): RemotePresence {
  return {
    selectedObjectIds: [],
    lasers: [],
    previews: [],
  };
}