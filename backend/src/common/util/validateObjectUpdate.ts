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
    const definedChanges = Object.fromEntries(
        Object.entries(changes).filter(([, value]) => value !== undefined)
    ) as Partial<BoardObjectDTO>;

    switch (existing.type) {
        case "arrow":
            validateArrowUpdate(definedChanges);
            return;

        case "circle":
            validateCircleUpdate(definedChanges);
            return;

        case "rectangle":
            validateRectangleUpdate(definedChanges);
            return;

        case "stroke":
            validateStrokeUpdate(definedChanges);
            return;

        case "textbox":
            validateTextboxUpdate(definedChanges);
            return;

        case "triangle":
            validateTriangleUpdate(definedChanges);
            return;

        default:
            throw new BadRequestException(
                `Unsupported object type: ${existing.type}`,
            );
    }
}