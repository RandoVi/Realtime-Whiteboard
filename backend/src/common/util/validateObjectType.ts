import { BadRequestException } from "@nestjs/common/exceptions";
import { BoardObjectDTO } from "../../modules/board/dto/BoardObjectDTO";
import { validateArrow } from "./validators/validateArrow";
import { validateCircle } from "./validators/validateCircle";
import { validateRectangle } from "./validators/validateRectangle";
import { validateStroke } from "./validators/validateStroke";
import { validateTextbox } from "./validators/validateTextbox";
import { validateTriangle } from "./validators/validateTriangle";
import { BoardObject } from "../../modules/board/schemas/BoardObjectSchema";

export function validateObjectType(objectData: BoardObjectDTO): BoardObject{
    switch(objectData.type) {
        case "arrow": {
            return validateArrow(objectData)
        }
        case "circle": {
            return validateCircle(objectData)
        }
        case "rectangle": {
            return validateRectangle(objectData)
        }
        case "stroke": {
            return validateStroke(objectData)
        }
        case "textbox": {
            return validateTextbox(objectData)
        }
        case "triangle": {
            return validateTriangle(objectData)
        }
        default: {
            throw new BadRequestException("Unsupported object type");
        }
    }
}