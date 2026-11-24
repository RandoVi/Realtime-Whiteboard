import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../modules/board/schemas/BoardObjectSchema";
import { getShapeValidator } from "./shapeValidators";

export function validateObjectType(objectData: BoardObjectDTO): BoardObject {
  const validator = getShapeValidator(objectData.type);

  if (!validator) {
    throw new BadRequestException("Unsupported object type");
  }

  return validator.create(objectData);
}