import type { Shape } from "../../types/Shape";

type Args = {
  shapes: Shape[];
  shapeId: string;
};

export function deleteShape({
  shapes,
  shapeId,
}: Args) {

  const index = shapes.findIndex(
    shape => shape.id === shapeId
  );

  if (index === -1) {
    return;
  }

  shapes.splice(index, 1);
}