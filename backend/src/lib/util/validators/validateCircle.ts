import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../../modules/board/schemas/BoardObjectSchema";

export function validateCircle(data: BoardObjectDTO): BoardObject {
    if (data.type !== "circle") {
        throw new BadRequestException("Object is not a circle");
    }

    if (
        data.x === undefined ||
        data.y === undefined ||
        data.radius === undefined ||
        data.rotation === undefined ||
        data.fill === undefined ||
        data.stroke === undefined ||
        data.strokeWidth === undefined
    ) {
        throw new BadRequestException(
            "Invalid circle: missing required fields"
        );
    }

    return {
        id: data.id,
        type: "circle",
        x: data.x,
        y: data.y,
        radius: data.radius,
        rotation: data.rotation,
        fill: data.fill,
        stroke: data.stroke,
        strokeWidth: data.strokeWidth
    };
}