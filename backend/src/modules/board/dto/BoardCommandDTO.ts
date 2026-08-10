import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BoardUser } from '../../../models/boardUser';
import { BoardCommandType } from '../../../common/enum/BoardCommandType';

export class BoardCommandDTO {
  @IsString()
  id?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BoardUser)
  user?: BoardUser;

  @IsOptional()
  @IsEnum(BoardCommandType)
  type?: BoardCommandType;
}