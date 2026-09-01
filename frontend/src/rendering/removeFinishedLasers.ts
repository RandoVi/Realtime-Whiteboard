import type { Laser } from "@common/shapes";
import type { RemotePresence } from "../network/presence/RemotePresence";

export function removeFinishedLasers(
    localLasers: Laser[],
    remotePresence: Map<string, RemotePresence>,
    finishedLocalLasers: Laser[],
    finishedRemoteLasers: {
        userId: string;
        laser: Laser;
    }[],
) {
    for (const laser of finishedLocalLasers) {
        const index = localLasers.findIndex(
            item => item.id === laser.id
        );

        if (index !== -1) {
            localLasers.splice(index, 1);
        }
    }

    for (const { userId, laser } of finishedRemoteLasers) {
        const presence = remotePresence.get(userId);

        if (!presence) {
            continue;
        }

        const index = presence.lasers.findIndex(
            item => item.id === laser.id
        );

        if (index !== -1) {
            presence.lasers.splice(index, 1);
        }
    }
}