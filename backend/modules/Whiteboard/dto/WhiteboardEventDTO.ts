import { IsString, MinLength } from "class-validator";

export class WhiteboardEventDTO {
  @IsString()
  @MinLength(1)
  name?: string;

  boardId!: string;
  event!:Object;
}