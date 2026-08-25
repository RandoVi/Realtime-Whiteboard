import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../../modules/board/schemas/BoardObjectSchema";

export function validateStroke(data: BoardObjectDTO): BoardObject {
    if (data.type !== "stroke") {
        throw new BadRequestException("Object is not a stroke");
    }

    if (
        data.points === undefined ||
        data.stroke === undefined ||
        data.strokeWidth === undefined
    ) {
        throw new BadRequestException(
            "Invalid stroke: missing required fields"
        );
    }

    return {
        id: data.id,
        type: "stroke",
        points: data.points,
        stroke: data.stroke,
        strokeWidth: data.strokeWidth,
    };
}