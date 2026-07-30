export type MovePreviewCommand = {
    type: "moveObjectPreview";
    boardObjectId: string;

    x:number;
    y:number;
};

export type CursorMovementCommand = {
    type: "cursorMovement";
};

export type PresenceCommand =
    | MovePreviewCommand
    | CursorMovementCommand;