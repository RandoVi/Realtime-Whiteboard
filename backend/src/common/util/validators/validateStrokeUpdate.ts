import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";

export function validateStrokeUpdate(
    data: Partial<BoardObjectDTO>
): void {
    const allowedFields = [
        "points",
        "stroke",
        "strokeWidth",
    ];

    for (const field of Object.keys(data)) {
        if (!allowedFields.includes(field)) {
            throw new BadRequestException(
                `Field '${field}' cannot be updated on a stroke`
            );
        }
    }
}