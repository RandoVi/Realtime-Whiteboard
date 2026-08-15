import type { Laser } from "../shapes";
import type { Point } from "../types";
import type { Object } from "../types/Object";

export type ObjectSelectionCommand = {
    type: "selection";
    objectId?: string;
};

export type ObjectPreviewCommand =
  | {
      type: "objectPreview";
      previewType: "create";
      boardObject: Object;
    }
  | {
      type: "objectPreview";
      previewType: "update";
      boardObjectId: string;
      updates: Partial<Object>;
    }
  | {
      type: "objectPreview";
      previewType: "clear";
    };
export type LaserCommand =
    | {
        type: "laser";
        laserType: "create";
        laser: Laser;
    }
    | {
        type: "laser";
        laserType: "point";
        laserId: string;
        point: Point;
    };

export type CursorMovementCommand = {
    type: "cursorMovement";
    point: Point;
};

export type SelectionCommand = {
    type: "selection";
    objectId: string | null;
};

export type PresenceCommand =
    | CursorMovementCommand
    | ObjectPreviewCommand
    | SelectionCommand
    | LaserCommand;