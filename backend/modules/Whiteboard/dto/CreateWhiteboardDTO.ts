import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateWhiteboardDTO {

  @IsString()
  name!: string;

}