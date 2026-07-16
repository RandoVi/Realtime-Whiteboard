import type { Camera, Point } from '../../Types'
import type { Shape } from '../../shapes/Shape'
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