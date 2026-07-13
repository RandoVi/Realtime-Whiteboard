import { IsString, MinLength } from "class-validator";

export class User {

  id!: string;
  
  @IsString()
  @MinLength(1)
  name!: string;

}