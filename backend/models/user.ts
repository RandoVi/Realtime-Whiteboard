import { IsString } from "class-validator";

export class BoardUser {
    @IsString()
    id!: string;

    @IsString()
    username!: string;
}