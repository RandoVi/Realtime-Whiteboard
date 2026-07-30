import type { PresenceCommand } from "./PresenceCommand";

export interface Presence {
    send(command: PresenceCommand): void;

    onCommand(
        handler: (command: PresenceCommand) => void
    ): void;
}