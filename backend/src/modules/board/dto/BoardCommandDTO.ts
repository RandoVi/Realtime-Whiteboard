import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BoardUser } from '../../../models/boardUser';

import { BoardUserDTO } from './BoardUserDTO';
import { BoardCommandType } from '../../../lib/types/BoardCommandType';

export class BoardCommandDTO {
  @IsString()
  id?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BoardUser)
  user?: BoardUserDTO;

  @IsOptional()
  @IsEnum(BoardCommandType)
  type?: BoardCommandType;
}