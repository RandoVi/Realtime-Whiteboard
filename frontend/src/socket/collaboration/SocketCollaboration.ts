import type { Collaboration } from "./Collaboration";
import type { EditorCommand } from "../../editor/EditorCommand";
import { SOCKET_EVENTS } from "../../network/events";
import type { NetworkCommand } from "../../network/NetworkCommand";
import { getBoardId } from "../../network/board";
import type { BoardStateDTO } from "./BoardStateDTO";
import { socket } from "../SocketClient";
import { getCurrentUser } from "../../network/currentUser";


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
        callback: (boardState: BoardStateDTO) => void
    ): void {

        socket.emit(
            SOCKET_EVENTS.BOARD_COMMAND,
            {
                type: "CREATE",
                user: {
                    username: "Host"
                }
            }
        );

        socket.once(
            "board-state",
            (boardState: BoardStateDTO) => {
                console.log(
                    boardState,
                    "COMPARE(create)",
                    JSON.stringify(boardState.userId),
                    JSON.stringify(boardState.users[0].id),
                    boardState.userId === boardState.users[0].id
                );
                callback(boardState);
            }
        );;
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
                    username: "Leech"
                }
            }
        );

        socket.once(
            "board-state",
            (boardState: BoardStateDTO) => {
                                console.log(
                    "log", boardState,
                    "COMPARE(join)",
                    JSON.stringify(boardState.userId),
                    JSON.stringify(boardState.users[0].id),
                    boardState.userId === boardState.users[0].id
                );
                callback(boardState);
            }
        );

    }

    //Board Specific Commands
    send(command: EditorCommand): void {
        const currentUser =
            getCurrentUser();

        if (!currentUser) {
            throw new Error(
                "Current user is not initialized."
            );
        }

        const message: NetworkCommand = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
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