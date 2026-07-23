import type { Shape } from "../../types/Shape";
import { getShapeById } from "../../shapes/getShapeById";

type Args = {
  shapes: Shape[];
  shapeId: string;
  updates: Partial<Shape>;
};

export function updateShape({
  shapes,
  shapeId,
  updates,
}: Args) {
  const shape = getShapeById(
    shapes,
    shapeId
  );

  if (!shape) {
    return;
  }

  Object.assign(
    shape,
    updates
  );
}