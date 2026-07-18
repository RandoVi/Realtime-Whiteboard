import { IsString, MinLength } from "class-validator";

export class WhiteboardEventSchema {

  id!: string;
  
  @IsString()
  @MinLength(1)
  name!: string;

}