import type { Camera, Point } from '../types/Types'
import type { Shape } from '../types/Shape'
import { getResizeHandleForShape } from './getResizeHandleForShape'

export function getSelectionHandle(
  shape: Shape | undefined,
  pointer: Point,
  camera: Camera,
) {
  if (!shape) {
    return null
  }

  return getResizeHandleForShape(
    shape,
    pointer,
    camera,
  )
}