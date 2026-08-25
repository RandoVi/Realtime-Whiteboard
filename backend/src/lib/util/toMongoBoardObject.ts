import { BoardObject as CommonBoardObject } from "@whiteboard/common";
import { BoardObject as MongoBoardObject } from "../../modules/board/schemas/BoardObjectSchema"

export function toMongoBoardObject(
  object: CommonBoardObject,
): MongoBoardObject {
  return { ...object } as MongoBoardObject;
}