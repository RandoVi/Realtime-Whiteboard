import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";

export function validateArrowUpdate(
    changes: Partial<BoardObjectDTO>,
): void {

    const allowed = new Set([
        "id",
        "x",
        "y",
        "width",
        "height",
        "rotation",
        "fill",
        "stroke",
    ]);

    for (const key of Object.keys(changes)) {
        if (!allowed.has(key)) {
            throw new BadRequestException(
                `Property '${key}' cannot be updated on an arrow`
            );
        }
    }
}