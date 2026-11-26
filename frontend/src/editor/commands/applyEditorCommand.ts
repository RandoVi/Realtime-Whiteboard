import type { MutableRefObject } from "react";
import type { EditorCommand } from "@common/commands";
import type { BoardObject } from "@common/types";
import { bringObjectToFront } from "../../interaction/helpers/bringObjectToFront";
import { bringObjectsToFront } from "../../interaction/helpers/bringObjectsToFront";
import { deleteObject } from "./deleteObject";
import { insertObject } from "./insertObject";
import { updateObject } from "./updateObject";

type Args = {
  command: EditorCommand;
  objects: BoardObject[];
  selectedObjectIdRef: MutableRefObject<string | null>;
  setSelectedObjectId: (id: string | null) => void;
};

export function applyEditorCommand({
  command,
  objects,
  selectedObjectIdRef,
  setSelectedObjectId,
}: Args): void {
  switch (command.type) {
    case "createBoardObject":
      insertObject({ objects, object: command.boardObject });
      break;

    case "updateBoardObject":
      updateObject({
        objects,
        objectId: command.boardObjectId,
        updates: command.updates,
      });
      break;

    case "deleteBoardObject":
      deleteObject({ objects, objectId: command.boardObjectId });
      if (selectedObjectIdRef.current === command.boardObjectId) {
        selectedObjectIdRef.current = null;
        setSelectedObjectId(null);
      }
      break;

    case "bringBoardObjectToFront":
      bringObjectToFront({ objects, objectId: command.boardObjectId });
      break;

    case "bringBoardObjectsToFront":
      bringObjectsToFront({ objects, objectIds: command.boardObjectIds });
      break;
  }
}
