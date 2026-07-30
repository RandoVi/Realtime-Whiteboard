import type { Collaboration } from "./Collaboration";
import type { EditorCommand } from "../../editor/EditorCommand";
import { io, Socket } from "socket.io-client";
import { clientId } from "../../network/client";
import { SOCKET_EVENTS } from "../../network/events";
import type { NetworkCommand } from "../../network/NetworkCommand";
import { getBoardId } from "../../network/board";
import type { BoardStateDTO } from "./BoardStateDTO";



export class SocketCollaboration implements Collaboration {
    private socket: Socket;

    private commandHandler?:
        (command: EditorCommand) => void;

    constructor() {
        this.socket = io("http://localhost:3000", {
            withCredentials: true,
            transports: ["websocket"],
        });

        this.socket.on(
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

        this.socket.emit(
            SOCKET_EVENTS.BOARD_COMMAND,
            {
                type: "CREATE"
            }
        );

        this.socket.once(
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

        this.socket.emit(
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

        this.socket.once(
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

        this.socket.emit(
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