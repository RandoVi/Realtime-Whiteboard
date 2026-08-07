import { IsString } from "class-validator";
import { UserColor } from "../managers/ColorManager";
export class BoardUser {
    @IsString()
    id!: string;

    @IsString()
    username!: string;

    @IsString()
    color?: UserColor;

    constructor (id: string,username: string) {
        this.id = id;
        this.username = username;
    }
}