import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../../modules/board/schemas/BoardObjectSchema";

export function validateTextbox(data: BoardObjectDTO): BoardObject {
    if (data.type !== "textbox") {
        throw new BadRequestException("Object is not a textbox");
    }

    if (
        data.x === undefined ||
        data.y === undefined ||
        data.width === undefined ||
        data.height === undefined ||
        data.rotation === undefined ||
        data.fill === undefined ||
        data.text === undefined ||
        data.fontSize === undefined ||
        data.fontFamily === undefined ||
        data.fontWeight === undefined ||
        data.background === undefined
    ) {
        throw new BadRequestException(
            "Invalid textbox: missing required fields"
        );
    }

    return {
        id: data.id,
        type: "textbox",
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        rotation: data.rotation,
        fill: data.fill,
        text: data.text,
        fontSize: data.fontSize,
        fontFamily: data.fontFamily,
        fontWeight: data.fontWeight,
        background: data.background
    };
}