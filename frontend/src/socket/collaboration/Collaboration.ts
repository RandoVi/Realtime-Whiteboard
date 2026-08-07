import type { EditorCommand } from "../../editor/EditorCommand";
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
        callback: (boardState: BoardStateDTO) => void
    ): void;

    joinBoard(
        boardId: string,
        callback: (boardState: BoardStateDTO) => void
    ): void;
}