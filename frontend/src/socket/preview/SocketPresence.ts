import { clientId } from "../../network/client";
import { boardId } from "../../network/board";
import type { Presence } from "./Presence";
import type { PresenceCommand } from "./PresenceCommand";
import { socket } from "../SocketClient";

export class SocketPresence implements Presence {


    private commandHandler?:
        (command: PresenceCommand) => void;


    constructor() {

        socket.on(
            "boardPresenceCommand",
            (message) => {

                this.commandHandler?.(
                    message.command
                );

            }
        );
    }


    send(command: PresenceCommand): void {

        const message = {
            id: crypto.randomUUID(),
            clientId,
            boardId,
            command,
        };


        socket.emit(
            "boardPresenceCommand",
            message
        );
    }


    onCommand(
        handler: (command: PresenceCommand) => void
    ): void {

        this.commandHandler = handler;

    }
}