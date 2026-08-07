import { IsString, MinLength } from "class-validator";
import { BoardObject } from "../../boardObjects/schemas/BoardObjectSchema";

export class BoardUpdateDTO {
  @IsString()
  @MinLength(1)
  boardId!: string;
  
  boardObjects!:BoardObject[];
}