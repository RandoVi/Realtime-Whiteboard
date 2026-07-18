import { IsString, MinLength } from "class-validator";
import { Types } from "mongoose";

export class WhiteboardEventSchema {

  _id!: Types.ObjectId;
  
  @IsString()
  @MinLength(1)
  name!: string;

}