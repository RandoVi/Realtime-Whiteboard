import { BoardObject } from "../../boardObjects/schemas/BoardObjectSchema";
import { BoardUser } from "../../../models/boardUser";

export class BoardStateDTO {
      constructor(
    public readonly boardId: string,
    public readonly ownerId: string,
    public readonly objects: BoardObject[],
    public readonly users: BoardUser[],
  ) {}

}