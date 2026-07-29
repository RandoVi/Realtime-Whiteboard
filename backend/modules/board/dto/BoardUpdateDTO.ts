import { IsString, MinLength } from "class-validator";
import { Shape } from "../../../models/shape";

export class BoardUpdateDTO {
  @IsString()
  @MinLength(1)
  boardId!: string;
  
  shapes!:Shape[];
}