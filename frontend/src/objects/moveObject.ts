import type { Object } from "@common/types"
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