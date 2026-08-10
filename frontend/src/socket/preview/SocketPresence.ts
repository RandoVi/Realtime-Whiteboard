
import { boardId } from "../../network/board";
import type { Presence } from "./Presence";
import type { PresenceCommand } from "./PresenceCommand";
import { socket } from "../SocketClient";
import { getCurrentUser } from "../../network/currentUser";

export class SocketPresence implements Presence {


    private commandHandler?:
        (userId: string, command: PresenceCommand) => void


    constructor() {

        socket.on(
            "boardPresenceCommand",
            message => {
                this.commandHandler?.(
                    message.userId,
                    message.command,

                );
            }
        );
    }


    send(command: PresenceCommand): void {

        const currentUser = getCurrentUser();

        const message = {
            id: crypto.randomUUID(),
            userId: currentUser.userId,
            boardId,
            command,
        };
        // console.log("Sending presence command:", message);

        socket.emit(
            "boardPresenceCommand",
            message
        );
    }


    onCommand(
        handler: (
            userId: string,
            command: PresenceCommand,
        ) => void
    ): void {

        this.commandHandler = handler;

    }
}