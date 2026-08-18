import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";

export function validateTriangleUpdate(
    data: Partial<BoardObjectDTO>
): void {
    const allowedFields = [
        "id",
        "x",
        "y",
        "width",
        "height",
        "rotation",
        "fill",
        "stroke",
    ];

    for (const field of Object.keys(data)) {
        if (!allowedFields.includes(field)) {
            throw new BadRequestException(
                `Field '${field}' cannot be updated on a triangle`
            );
        }
    }
}