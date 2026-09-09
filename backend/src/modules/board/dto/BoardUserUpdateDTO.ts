import { IsString, IsNotEmpty, MaxLength, ValidateNested } from "class-validator";
import { BoardUserDTO } from "./BoardUserDTO";
import { Type } from "class-transformer";

export class BoardUserUpdateDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    boardId!: string;

    @ValidateNested()
    @Type(() => BoardUserDTO)
    boardUser!: BoardUserDTO;
}