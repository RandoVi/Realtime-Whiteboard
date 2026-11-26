import type { EditorCommand } from "@common/commands";
import type { CanvasText, Textbox } from "@common/shapes";
import type { BoardObject } from "@common/types";
import { getObjectById } from "../../objects/getObjectById";
import { getMinimumTextSize } from "../../objects/getMinimumTextSize";

export function fitTextCommand(
  command: EditorCommand,
  objects: BoardObject[],
): EditorCommand {
  if (command.type === "createBoardObject") {
    const object = command.boardObject;

    if (object.type !== "text" && object.type !== "textbox") {
      return command;
    }

    const minimum = getMinimumTextSize(object, object.width);
    const width = Math.max(object.width, minimum.width);
    const height = Math.max(
      object.height,
      getMinimumTextSize(object, width).height,
    );

    return {
      ...command,
      boardObject: { ...object, width, height },
    };
  }

  if (command.type !== "updateBoardObject") {
    return command;
  }

  const current = getObjectById(objects, command.boardObjectId);
  if (
    !current ||
    (current.type !== "text" && current.type !== "textbox")
  ) {
    return command;
  }

  const next = {
    ...current,
    ...command.updates,
  } as CanvasText | Textbox;

  const minimum = getMinimumTextSize(next, next.width);
  const width = Math.max(next.width, minimum.width);
  const height = Math.max(
    next.height,
    getMinimumTextSize(next, width).height,
  );

  return {
    ...command,
    updates: {
      ...command.updates,
      width,
      height,
    },
  };
}
