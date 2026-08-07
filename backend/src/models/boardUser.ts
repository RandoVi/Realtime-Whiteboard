import { IsString } from "class-validator";
import { UserColor } from "../managers/ColorManager";
export class BoardUser {
    @IsString()
    userId!: string;

    @IsString()
    username!: string;

    @IsString()
    color?: UserColor;

    constructor (id: string,username: string) {
        this.userId = id;
        this.username = username;
    }
}