import type { Point } from "../../types/Types";
import type { PresenceCommand } from "./PresenceCommand";

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