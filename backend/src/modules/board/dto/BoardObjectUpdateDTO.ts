import { Type } from "class-transformer";
import { IsString, IsNotEmpty, MaxLength, ValidateNested } from "class-validator";
import { BoardObjectDTO } from "./BoardObjectDTO";

export class BoardObjectUpdateDTO {

    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    boardId!: string;
    
    @ValidateNested()
    @Type(() => BoardObjectDTO)
    boardObject!: BoardObjectDTO;
}