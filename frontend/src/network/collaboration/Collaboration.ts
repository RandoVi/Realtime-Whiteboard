import type { EditorCommand } from "@common/commands";
import type { BoardStateDTO } from "./BoardStateDTO";


export interface Collaboration {
    send(
        command: EditorCommand
    ): void;

    onCommand(
        handler: (
            command: EditorCommand
        ) => void
    ): void;

    createBoard(
        username: string,
        callback: (boardState: BoardStateDTO) => void
    ): void;

    joinBoard(
        boardId: string,
        username: string,
        callback: (boardState: BoardStateDTO) => void
    ): void;
}