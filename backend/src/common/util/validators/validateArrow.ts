import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../../modules/board/schemas/BoardObjectSchema";

export function validateArrow(data: BoardObjectDTO): BoardObject {
    if (data.type !== "arrow") {
        throw new BadRequestException("Object is not an arrow");
    }

    if (
        data.x === undefined ||
        data.y === undefined ||
        data.width === undefined ||
        data.height === undefined ||
        data.rotation === undefined ||
        data.fill === undefined ||
        data.stroke === undefined
    ) {
        throw new BadRequestException(
            "Invalid arrow: missing required fields"
        );
    }

    return {
        id: data.id,
        type: "arrow",
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        rotation: data.rotation,
        fill: data.fill,
        stroke: data.stroke,
    };
}