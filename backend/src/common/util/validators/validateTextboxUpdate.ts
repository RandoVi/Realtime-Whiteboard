import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";

export function validateTextboxUpdate(
    data: Partial<BoardObjectDTO>
): void {
    const allowedFields = [
        "x",
        "y",
        "width",
        "height",
        "rotation",
        "fill",
        "text",
        "fontSize",
        "fontFamily",
        "fontWeight",
        "background",
    ];

    for (const field of Object.keys(data)) {
        if (!allowedFields.includes(field)) {
            throw new BadRequestException(
                `Field '${field}' cannot be updated on a textbox`
            );
        }
    }
}