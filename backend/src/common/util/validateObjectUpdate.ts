import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../modules/board/schemas/BoardObjectSchema";
import { validateArrowUpdate } from "./validators/validateArrowUpdate";
import { validateCircleUpdate } from "./validators/validateCircleUpdate";
import { validateRectangleUpdate } from "./validators/validateRectangleUpdate";
import { validateStrokeUpdate } from "./validators/validateStrokeUpdate";
import { validateTextboxUpdate } from "./validators/validateTextboxUpdate";
import { validateTriangleUpdate } from "./validators/validateTriangleUpdate";

export function validateObjectUpdate(existing: BoardObject, changes: Partial<BoardObjectDTO>): void {
    switch (existing.type) {
        case "arrow":
            validateArrowUpdate(changes);
            return;

        case "circle":
            validateCircleUpdate(changes);
            return;

        case "rectangle":
            validateRectangleUpdate(changes);
            return;

        case "stroke":
            validateStrokeUpdate(changes);
            return;

        case "textbox":
            validateTextboxUpdate(changes);
            return;

        case "triangle":
            validateTriangleUpdate(changes);
            return;

        default:
            throw new BadRequestException(
                `Unsupported object type: ${existing.type}`,
            );
    }
}