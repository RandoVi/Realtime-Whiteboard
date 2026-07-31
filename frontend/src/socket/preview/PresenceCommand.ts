import type { Shape } from "../../types/Shape";


export type ObjectPreviewCommand =
  | {
      type: "objectPreview";
      previewType: "create"; //indicates that the object is being created
      boardObject: Shape; //bcs object doesn't exist yet, we send the whole object
    }
  | {
      type: "objectPreview";
      previewType: "update"; //indicates update of an existing object
      boardObjectId: string;
      updates: Partial<Shape>; //bcs object already exists, we send only the updates(partial)
    };

export type CursorMovementCommand = {
    type: "cursorMovement";
};

export type PresenceCommand =
    | ObjectPreviewCommand
    | CursorMovementCommand;