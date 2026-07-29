import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BoardUser } from '../../../models/user';
import { BoardCommand } from '../../../common/enum/BoardCommand';

export class BoardCommandDTO {
  @IsString()
  id?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BoardUser)
  user?: BoardUser;

  @IsOptional()
  @IsEnum(BoardCommand)
  type!: BoardCommand;
}