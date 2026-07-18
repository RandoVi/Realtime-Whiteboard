import { IsString, MinLength } from 'class-validator';

export class UserDTO {
  @IsString()
  @MinLength(1)
  name?: string;
}