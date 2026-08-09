import type { Collaboration } from "./Collaboration";
import type { EditorCommand } from "../../editor/EditorCommand";
import { SOCKET_EVENTS } from "../../network/events";
import type { NetworkCommand } from "../../network/NetworkCommand";
import { getBoardId } from "../../network/board";
import type { BoardStateDTO } from "./BoardStateDTO";
import { socket } from "../SocketClient";
import { getCurrentUser } from "../../network/currentUser";
import type { BoardUser } from "../../board/BoardUser";


// Implements the Collaboration interface using WebSocket for real-time collaboration
// when creating and joining boards, as well as sending and receiving editor commands.
// This excludes preview functionality, which is handled separately in the SocketPresence class.
export class SocketCollaboration implements Collaboration {

    private commandHandler?:
        (command: EditorCommand) => void;

    private userJoinedHandler?: (user: BoardUser) => void;

    constructor() {


        socket.on(
            SOCKET_EVENTS.COMMAND,
            (message: NetworkCommand) => {
                this.commandHandler?.(
                    message.command
                );
            }
        );

        socket.on(
            "user-joined-board",
            (user: BoardUser) => {
                this.userJoinedHandler?.(user);
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
            userId: currentUser.userId,
            boardId: getBoardId(),
            command,
        };

        socket.emit(
            SOCKET_EVENTS.COMMAND,
            message
        );
    }

    onUserJoined(
        handler: (user: BoardUser) => void
    ) {
        this.userJoinedHandler = handler;
    }

    onCommand(
        handler: (command: EditorCommand) => void
    ): void {
        this.commandHandler = handler;
    }
}