import type { Collaboration } from "./Collaboration";
import type { EditorCommand } from "../../editor/EditorCommand";
import { clientId } from "../../network/client";
import { SOCKET_EVENTS } from "../../network/events";
import type { NetworkCommand } from "../../network/NetworkCommand";
import { getBoardId } from "../../network/board";
import type { BoardStateDTO } from "./BoardStateDTO";
import { socket } from "../SocketClient";


// Implements the Collaboration interface using WebSocket for real-time collaboration
// when creating and joining boards, as well as sending and receiving editor commands.
// This excludes preview functionality, which is handled separately in the SocketPresence class.
export class SocketCollaboration implements Collaboration {

    private commandHandler?:
        (command: EditorCommand) => void;

    constructor() {


     socket.on(
            SOCKET_EVENTS.COMMAND,
            (message: NetworkCommand) => {
                this.commandHandler?.(
                    message.command
                );
            }
        );
    }
    //Board General Commands
    createBoard(
        callback: (boardId: string) => void
    ): void {

       socket.emit(
            SOCKET_EVENTS.BOARD_COMMAND,
            {
                type: "CREATE"
            }
        );

        socket.once(
            "created",
            (data: {
                boardId: string
                hostId: string
            }) => {
                callback(data.boardId);
            }
        );
    }

    joinBoard(
        boardId: string,
        callback: (boardState: BoardStateDTO) => void
    ): void {

        socket.emit(
            "boardCommand",
            {
                type: "JOIN",
                id: boardId,
                user: {
                    id: clientId,
                    username: "HOST" // or whatever you'll use later
                }
            }
        );

        socket.once(
            "board-state",
            (boardState: BoardStateDTO) => {
                callback(boardState);
            }
        );
    }

    //Board Specific Commands
    send(command: EditorCommand): void {
        const message: NetworkCommand = {
            id: crypto.randomUUID(),
            clientId,
            boardId: getBoardId(),
            command,
        };

        socket.emit(
            SOCKET_EVENTS.COMMAND,
            message
        );
        console.log(SOCKET_EVENTS.COMMAND);
        console.log(message);
    }

    onCommand(
        handler: (command: EditorCommand) => void
    ): void {
        this.commandHandler = handler;
    }
}