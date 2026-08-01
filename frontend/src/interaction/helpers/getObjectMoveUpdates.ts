import type { Object } from "../../types/Object";
export function getObjectMoveUpdates(
  object: Object
): Partial<Object> {

  switch (object.type) {

    case "rectangle":
      return {
        x: object.x,
        y: object.y,
      };

    case "circle":
      return {
        x: object.x,
        y: object.y,
      };

    case "stroke":
      return {
        points: object.points,
      };

    default:
      return {};
  }
}