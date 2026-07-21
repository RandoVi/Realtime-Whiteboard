import { IsOptional, IsString } from "class-validator";

export class UpdateWhiteboardDTO {

  @IsOptional()
  @IsString()
  name!: string;

}