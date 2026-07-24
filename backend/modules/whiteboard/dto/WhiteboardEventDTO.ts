import { IsString, MinLength } from "class-validator";

export class WhiteboardEventDTO {
  @IsString()
  @MinLength(1)
  boardId!: string;
  
  event!:Object;
}