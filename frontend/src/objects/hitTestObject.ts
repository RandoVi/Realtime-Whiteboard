import type { Object, Point } from "@common/types"
import { getObjectHandler } from './registry/getObjectHandler'



//function to check if this world point is inside a object
export function hitTestObject(
  point: Point,
  object: Object,
): boolean {
  return (
    getObjectHandler(object)
      .hitTest?.(
        point,
        object,
      ) ?? false
  )
}