import { IsString, MinLength } from "class-validator";
import { BoardObject } from "../../boardObjects/schemas/BoardObjectSchema";
import { BoardUser } from "../../../models/user";

export class BoardStateDTO {
      constructor(
    public readonly boardId: string,
    public readonly ownerId: string,
    public readonly objects: BoardObject[],
    public readonly users: BoardUser[],
  ) {}

}