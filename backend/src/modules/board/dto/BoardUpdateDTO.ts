import { IsArray, IsNotEmpty, IsString, MaxLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { BoardObjectDTO } from "./BoardObjectDTO";
import { BoardUserDTO } from "./BoardUserDTO";

export class BoardUpdateDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  boardId!: string;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardObjectDTO)
  boardObjects?:BoardObjectDTO[];

  boardUsers?: BoardUserDTO[];

  constructor(boardId: string, boardObjects: BoardObjectDTO[], boardUsers: BoardUserDTO[]) {
    this.boardId = boardId;
    this.boardObjects = boardObjects;
    this.boardUsers = boardUsers;
  }
}