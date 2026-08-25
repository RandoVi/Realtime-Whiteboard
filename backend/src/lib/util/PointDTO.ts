import { IsNumber } from "class-validator";

export class LaserPointsDTO {
    @IsNumber()
    x!: number;

    @IsNumber()
    y!: number;
}