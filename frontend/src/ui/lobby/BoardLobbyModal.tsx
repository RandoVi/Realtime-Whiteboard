// BoardLobbyModal.tsx

import "./BoardLobbyModal.css";
import { useState } from "react";

type Props = {
    state: LobbyState;

    boardId: string;
    onBoardIdChange: (value: string) => void;

    username: string;
    onUsernameChange: (value: string) => void;

    onCreate: () => void;
    onJoin: () => void;
    onStart: () => void;
};

const MIN_USERNAME_LENGTH = 2;
const MAX_USERNAME_LENGTH = 20;

function validateUsername(username: string): string | null {
    const name = username.trim();

    if (!name) {
        return "Username is required.";
    }

    if (name.length < MIN_USERNAME_LENGTH) {
        return `Username must be at least ${MIN_USERNAME_LENGTH} characters.`;
    }

    if (name.length > MAX_USERNAME_LENGTH) {
        return `Username must be ${MAX_USERNAME_LENGTH} characters or less.`;
    }

    return null;
}

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
    username,
    onUsernameChange,
    onCreate,
    onJoin,
    onStart,
}: Props) {
    const [mode, setMode] = useState<"create" | "join">("create");
    const [copied, setCopied] = useState(false);

    if (state === "connected") {
        return null;
    }

    const usernameError = validateUsername(username);
    const validUsername = usernameError === null;
    const validBoardId = boardId.trim().length > 0;

    const handleCopyBoardId = async () => {
        try {
            await navigator.clipboard.writeText(boardId);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            console.error("Failed to copy board ID.");
        }
    };

    if (state === "lobby") {
        return (
            <div className="board-lobby-overlay">
                <div className="board-lobby">

                    <h2>Collaborative Whiteboard</h2>

                    <div className="lobby-field">
                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            value={username}
                            onChange={(e) =>
                                onUsernameChange(e.target.value)
                            }
                            placeholder="Your name"
                            maxLength={MAX_USERNAME_LENGTH}
                        />

                        <p className="input-error">
                            {usernameError || "\u00A0"}
                        </p>
                    </div>

                    <div className="lobby-tabs">
                        <button
                            className={mode === "create" ? "active" : ""}
                            onClick={() => setMode("create")}
                        >
                            Create Board
                        </button>

                        <button
                            className={mode === "join" ? "active" : ""}
                            onClick={() => setMode("join")}
                        >
                            Join Board
                        </button>
                    </div>

                    {mode === "create" ? (
                        <div className="lobby-section">
                            <h3>Create a new board</h3>

                            <button
                                onClick={onCreate}
                                disabled={!validUsername}
                            >
                                Create Board
                            </button>
                        </div>
                    ) : (
                        <div className="lobby-section">
                            <div className="lobby-field">
                                <div className="label-with-info">
                                    <label htmlFor="board-id">
                                        Board ID
                                    </label>

                                    <span
                                        className="info-icon"
                                        tabIndex={0}
                                        aria-label="Board ID information"
                                    >
                                        ?
                                        <span className="info-tooltip">
                                            Enter the Board ID shared with you
                                            by the person who created the board.
                                        </span>
                                    </span>
                                </div>

                                <input
                                    id="board-id"
                                    value={boardId}
                                    onChange={(e) =>
                                        onBoardIdChange(e.target.value)
                                    }
                                    placeholder="Enter Board ID"
                                />
                            </div>

                            <button
                                onClick={onJoin}
                                disabled={!validUsername || !validBoardId}
                            >
                                Join Board
                            </button>
                        </div>
                    )}

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

    if (state === "joining") {
        return (
            <div className="board-lobby-overlay">
                <div className="board-lobby">
                    <h2>Joining Board</h2>

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

                    <p className="board-created-message">
                        Share this Board ID with your collaborators.
                    </p>

                    <div className="lobby-field">
                        <div className="label-with-info">
                            <label htmlFor="created-board-id">
                                Board ID
                            </label>

                            <span
                                className="info-icon"
                                tabIndex={0}
                                aria-label="Board ID information"
                            >
                                ?
                                <span className="info-tooltip">
                                    Share this ID with anyone you want
                                    to invite to this board.
                                </span>
                            </span>
                        </div>

                        <div className="board-id-copy">
                            <input
                                id="created-board-id"
                                value={boardId}
                                readOnly
                            />

                            <button onClick={handleCopyBoardId}>
                                {copied ? "Copied!" : "Copy ID"}
                            </button>
                        </div>
                    </div>

                    <button onClick={onStart}>
                        Start Whiteboard
                    </button>

                </div>
            </div>
        );
    }

    return null;
}