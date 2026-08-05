import { IsString } from "class-validator";
import { UserColors } from "../common/enum/UserColours";

export class BoardUser {
    @IsString()
    id!: string;

    @IsString()
    username!: string;

    @IsString()
    colour!: UserColors;
}