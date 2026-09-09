import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { LaserPointsDTO } from "../../../lib/util/PointDTO";

export class BoardObjectDTO {

    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    type!: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsNumber()
    x?: number;

    @IsOptional()
    @IsNumber()
    y?: number;

    @IsOptional()
    @IsNumber()
    width?: number;

    @IsOptional()
    @IsNumber()
    height?: number;

    @IsOptional()
    @IsNumber()
    rotation?: number;

    @IsOptional()
    @IsNumber()
    radius?: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LaserPointsDTO)
    points?: LaserPointsDTO;

    @IsOptional()
    @IsString()
    fill?: string;

    @IsOptional()
    @IsString()
    stroke?: string;

    @IsOptional()
    @IsNumber()
    strokeWidth?: number;

    @IsOptional()
    @IsNumber()
    updatedAt?: number;

    @IsOptional()
    @IsNumber()
    createdAt?: number;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsNumber()
    fontSize?: number;

    @IsOptional()
    @IsString()
    fontFamily?: string;

    @IsOptional()
    @IsNumber()
    fontWeight?: number;

    @IsOptional()
    @IsString()
    background?: string;
    
}