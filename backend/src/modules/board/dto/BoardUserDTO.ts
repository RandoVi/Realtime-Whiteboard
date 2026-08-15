import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { UserColor } from "../../../managers/ColorManager";

export class BoardUserDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    userId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    username!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    color?: UserColor;

    constructor (id: string,username: string) {
        this.userId = id;
        this.username = username;
    }
}