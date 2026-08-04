import type { Object } from "../types/Object";
import { getObjectHandler } from "./registry/getObjectHandler";


export function moveObject(
  object: Object,
  original: Object,
  dx: number,
  dy: number,
) {
  getObjectHandler(object)
    .move?.(
      object,
      original,
      dx,
      dy,
  )
}