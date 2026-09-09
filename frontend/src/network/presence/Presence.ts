import type { PresenceCommand } from "@common/commands";
import type { Point } from "@common/types";


export interface Presence {
    send(command: PresenceCommand): void;

    onCommand(
        handler: (
            userId: string,
            command: PresenceCommand,
        ) => void
    ): void;

    sendCursor(point: Point): void;
}