import { IsString, MinLength } from "class-validator";
import { BoardObject } from "../../boardObjects/schemas/BoardObjectSchema";
import { BoardUser } from "../../../models/boardUser";

export class BoardUpdateDTO {
  @IsString()
  @MinLength(1)
  boardId!: string;
  
  boardObjects?:BoardObject[];

  boardUsers?: BoardUser[];

  constructor(boardId: string, boardObjects: BoardObject[], boardUsers: BoardUser[]) {
    this.boardId = boardId;
    this.boardObjects = boardObjects;
    this.boardUsers = boardUsers;
  }
}