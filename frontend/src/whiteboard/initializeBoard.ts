import type { BoardStateDTO } from "../network/collaboration/BoardStateDTO";
import type { BoardDocument } from "../document/Document";
import type { Editor } from "../editor/Editor";
import type { LobbyState } from "../ui/lobby/BoardLobbyModal";
import { setBoardId as setNetworkBoardId } from "../network/board";
import { setCurrentUser } from "../network/currentUser";

type InitializeBoardOptions = {
    boardState: BoardStateDTO;
    document: BoardDocument;
    editor: Editor;
    setBoardId: (boardId: string) => void;
    setLobbyState: (state: LobbyState) => void;
    nextLobbyState: LobbyState;
    requestRender: () => void;
};

export function initializeBoard({
    boardState,
    document,
    editor,
    setBoardId,
    setLobbyState,
    nextLobbyState,
    requestRender,
}: InitializeBoardOptions) {
    setBoardId(boardState.boardId);
    setNetworkBoardId(boardState.boardId);

    document.load(
        boardState.objects,
        boardState.users,
    );

    editor.resetHistory();

    const currentUser = boardState.users.find(
        user => user.userId === boardState.userId
    );

    if (!currentUser) {
        throw new Error("Current user not found.");
    }

    setCurrentUser(currentUser);

    requestRender();
    setLobbyState(nextLobbyState);
}