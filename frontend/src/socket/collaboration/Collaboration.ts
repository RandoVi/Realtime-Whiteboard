
import type { EditorCommand } from "../../editor/EditorCommand";


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
        callback: (boardId: string) => void
    ): void;

}