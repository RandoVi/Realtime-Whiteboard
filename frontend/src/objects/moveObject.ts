import type { BoardObject } from "@common/types"
import { getObjectHandler } from "./registry/getObjectHandler";


export function moveObject(
  object: BoardObject,
  original: BoardObject,
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