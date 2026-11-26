import type { EditorCommand } from "@common/commands";
import type { BoardObject } from "@common/types";
import { getObjectById } from "../../objects/getObjectById";

export function createInverseCommand(
  command: EditorCommand,
  objects: BoardObject[],
): EditorCommand | undefined {
  switch (command.type) {
    case "createBoardObject":
      return {
        type: "deleteBoardObject",
        boardObjectId: command.boardObject.id,
      };

    case "deleteBoardObject": {
      const object = getObjectById(objects, command.boardObjectId);
      if (!object) {
        return undefined;
      }

      return {
        type: "createBoardObject",
        boardObject: structuredClone(object),
      };
    }

    case "updateBoardObject": {
      const object = getObjectById(objects, command.boardObjectId);
      if (!object) {
        return undefined;
      }

      const previousValues: Record<string, unknown> = {};
      for (const property of Object.keys(command.updates)) {
        previousValues[property] = structuredClone(
          object[property as keyof typeof object],
        );
      }

      return {
        type: "updateBoardObject",
        boardObjectId: command.boardObjectId,
        updates: previousValues as Partial<BoardObject>,
      };
    }

    case "bringBoardObjectToFront":
    case "bringBoardObjectsToFront":
      return undefined;
  }
}
