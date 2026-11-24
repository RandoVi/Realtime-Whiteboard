import type { BoardObject as SharedBoardObject } from "@whiteboard/common";
import type { BoardObjectDTO } from "../../modules/board/dto/BoardObjectDTO";
import type { BoardObject } from "../../modules/board/schemas/BoardObjectSchema";

import { validateArrow } from "./validators/validateArrow";
import { validateArrowUpdate } from "./validators/validateArrowUpdate";
import { validateCircle } from "./validators/validateCircle";
import { validateCircleUpdate } from "./validators/validateCircleUpdate";
import { validateRectangle } from "./validators/validateRectangle";
import { validateRectangleUpdate } from "./validators/validateRectangleUpdate";
import { validateStroke } from "./validators/validateStroke";
import { validateStrokeUpdate } from "./validators/validateStrokeUpdate";
import { validateText } from "./validators/validateText";
import { validateTextUpdate } from "./validators/validateTextUpdate";
import { validateTextbox } from "./validators/validateTextbox";
import { validateTextboxUpdate } from "./validators/validateTextboxUpdate";
import { validateTriangle } from "./validators/validateTriangle";
import { validateTriangleUpdate } from "./validators/validateTriangleUpdate";

type PersistedShapeType = Exclude<SharedBoardObject["type"], "laser">;

type ShapeValidator = {
  create: (data: BoardObjectDTO) => BoardObject;
  update: (changes: Partial<BoardObjectDTO>) => void;
};

export const shapeValidators = {
  arrow: { create: validateArrow, update: validateArrowUpdate },
  circle: { create: validateCircle, update: validateCircleUpdate },
  rectangle: { create: validateRectangle, update: validateRectangleUpdate },
  stroke: { create: validateStroke, update: validateStrokeUpdate },
  text: { create: validateText, update: validateTextUpdate },
  textbox: { create: validateTextbox, update: validateTextboxUpdate },
  triangle: { create: validateTriangle, update: validateTriangleUpdate },
} satisfies Record<PersistedShapeType, ShapeValidator>;

export function getShapeValidator(type: string): ShapeValidator | undefined {
  if (!Object.prototype.hasOwnProperty.call(shapeValidators, type)) {
    return undefined;
  }

  return shapeValidators[type as PersistedShapeType];
}