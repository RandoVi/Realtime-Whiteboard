import type { Collaboration } from "./Collaboration";
import type { EditorCommand } from "../../editor/EditorCommand";
import { io, Socket } from "socket.io-client";



export class SocketCollaboration implements Collaboration {

    private socket: Socket;

    constructor() {
        this.socket = io("http://localhost:3000");

        this.socket.on("command", (command: EditorCommand) => {
            this.commandHandler?.(command);
        });
    }

    private commandHandler?:
        (command: EditorCommand) => void;

    send(command: EditorCommand): void {
        this.socket.emit(
            "command",
            command
        );
    }

    onCommand(
        handler: (command: EditorCommand) => void
    ): void {
        this.commandHandler = handler;
    }

    // private receive(
    //     command: EditorCommand
    // ) {
    //     this.commandHandler?.(command);
    // }

}