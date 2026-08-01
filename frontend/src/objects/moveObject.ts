import type { Object } from "../types/Object";



export function moveObject(
  object: Object,
  original: Object,
  dx: number,
  dy: number,
) {

  switch (object.type) {

    case "rectangle":
      if (original.type === "rectangle") {
        object.x = original.x + dx
        object.y = original.y + dy
      }
      break;


    case "circle":
      if (original.type === "circle") {
        object.x = original.x + dx
        object.y = original.y + dy
      }
      break;


    case "stroke":
      if (original.type === "stroke") {

        object.points = original.points.map(point => ({
          x: point.x + dx,
          y: point.y + dy,
        }))

      }
      break;
  }
}