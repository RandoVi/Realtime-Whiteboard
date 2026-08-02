import type { Object } from "../types/Object";
import { moveCircle } from "./circle/moveCircle";
import { moveRectangle } from "./rectangle/moveRectangle";
import { moveStroke } from "./stroke/moveStroke";



export function moveObject(
  object: Object,
  original: Object,
  dx: number,
  dy: number,
) {
  switch (object.type) {
    case "rectangle":
      if (original.type === "rectangle") {
        moveRectangle(object, original, dx, dy);
      }
      break;

    case "circle":
      if (original.type === "circle") {
        moveCircle(object, original, dx, dy);
      }
      break;

    case "stroke":
      if (original.type === "stroke") {
        moveStroke(object, original, dx, dy);
      }
      break;
  }
}