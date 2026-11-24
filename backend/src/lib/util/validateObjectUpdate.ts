import { BadRequestException } from "@nestjs/common";
import { BoardObjectDTO } from "../../modules/board/dto/BoardObjectDTO";
import { BoardObject } from "../../modules/board/schemas/BoardObjectSchema";
import { getShapeValidator } from "./shapeValidators";

export function validateObjectUpdate(
  existing: BoardObject,
  changes: Partial<BoardObjectDTO>,
): void {
  const definedChanges = Object.fromEntries(
    Object.entries(changes).filter(([, value]) => value !== undefined),
  ) as Partial<BoardObjectDTO>;

  const validator = getShapeValidator(existing.type);

  if (!validator) {
    throw new BadRequestException(
      `Unsupported object type: ${existing.type}`,
    );
  }

  validator.update(definedChanges);
}