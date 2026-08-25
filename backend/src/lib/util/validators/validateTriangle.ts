import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../../modules/board/schemas/BoardObjectSchema";

export function validateTriangle(data: BoardObjectDTO): BoardObject {
    if (data.type !== "triangle") {
        throw new BadRequestException("Object is not a triangle");
    }

    if (
        data.x === undefined ||
        data.y === undefined ||
        data.width === undefined ||
        data.height === undefined ||
        data.rotation === undefined ||
        data.fill === undefined ||
        data.stroke === undefined ||
        data.strokeWidth === undefined
    ) {
        throw new BadRequestException(
            "Invalid triangle: missing required fields"
        );
    }

    return {
        id: data.id,
        type: "triangle",
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        rotation: data.rotation,
        fill: data.fill,
        stroke: data.stroke,
        strokeWidth: data.strokeWidth
    };
}