import { IsString } from "class-validator";
import { UserColors } from "../common/enum/UserColors";

export class BoardUser {
    @IsString()
    id!: string;

    @IsString()
    username!: string;

    @IsString()
    color!: UserColors;
}