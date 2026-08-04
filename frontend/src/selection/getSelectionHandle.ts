import type { Camera, Point } from '../types/Types'
import type { Object } from '../types/Object'
import { getResizeHandleForObject } from './getResizeHandleForObject'

export function getSelectionHandle(
  object: Object | undefined,
  pointer: Point,
  camera: Camera,
) {
  if (!object) {
    return null
  }

  return getResizeHandleForObject(
    object,
    pointer,
    camera,
  )
}