import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";

export function validateCircleUpdate(
    data: Partial<BoardObjectDTO>
): void {
    const allowedFields = [
        "id",
        "x",
        "y",
        "radius",
        "rotation",
        "fill",
        "stroke",
        "strokeWidth",
    ];

    for (const field of Object.keys(data)) {
        if (!allowedFields.includes(field)) {
            throw new BadRequestException(
                `Field '${field}' cannot be updated on a circle`
            );
        }
    }
}