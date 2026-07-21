import type { Shape } from "../../types/Shape";
import { getShapeById } from "../../shapes/getShapeById";

type Args = {
  shapes: Shape[];
  shapeId: string;
};

export function duplicateShape({
  shapes,
  shapeId,
}: Args) {

  const shape = getShapeById(
    shapes,
    shapeId
  );

  if (!shape) {
    return;
  }


  const copy = {
    ...shape,
    id: crypto.randomUUID(),
    x: shape.x + 20,
    y: shape.y + 20,
  };


  shapes.push(copy);
}