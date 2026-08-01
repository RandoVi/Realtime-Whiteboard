import type { Object } from "../../types/Object";

export function getObjectResizeUpdates(
  object: Object
): Partial<Object> {

  switch (object.type) {

    case "rectangle":
      return {
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
      };

    case "circle":
      return {
        x: object.x,
        y: object.y,
        radius: object.radius,
      };

    default:
      return {};
  }
}