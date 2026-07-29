// BoardLobbyModal.tsx

import "./BoardLobbyModal.css";

type Props = {
    state: LobbyState;

    boardId: string;
    onBoardIdChange: (value: string) => void;

    onCreate: () => void;
    onJoin: () => void;
    onStart: () => void;
};

export type LobbyState =
    | "lobby"
    | "creating"
    | "created"
    | "joining"
    | "connected";

export function BoardLobbyModal({
    state,
    boardId,
    onBoardIdChange,
    onCreate,
    onJoin,
}: Props) {
    if (!open) {
        return null;
    }

    if (state === "connected") {
        return null;
    }

    if (state === "lobby") {
        return (
            <div className="board-lobby-overlay">
                <div className="board-lobby">
                    <h2>Collaborative Whiteboard</h2>

                    <button onClick={onCreate}>
                        Create Board
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <input
                        value={boardId}
                        onChange={(e) => onBoardIdChange(e.target.value)}
                        placeholder="Board ID"
                    />

                    <button
                        onClick={onJoin}
                        disabled={!boardId.trim()}
                    >
                        Join Board
                    </button>
                </div>
            </div>
        );
    }

    if (state === "creating") {
        return (
            <div className="board-lobby-overlay">
                <div className="board-lobby">
                    <h2>Creating Board</h2>

                    <p>Waiting for server response...</p>
                </div>
            </div>
        );
    }

    if (state === "created") {
        return (
            <div className="board-lobby-overlay">
                <div className="board-lobby">
                    <h2>Board Created</h2>

                    <p>Board ID</p>

                    <input
                        value={boardId}
                        readOnly
                    />

                    <button>
                        Copy ID
                    </button>

                    <button>
                        Start Whiteboard
                    </button>
                </div>
            </div>
        );
    }
}