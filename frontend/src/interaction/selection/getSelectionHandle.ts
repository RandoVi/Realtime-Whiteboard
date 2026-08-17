import type { Camera } from "../../camera/Camera"
import type { BoardObject } from '@common/types'
import type { Point } from '@common/types'
import { getResizeHandleForObject } from './getResizeHandleForObject'

export function getSelectionHandle(
  object: BoardObject | undefined,
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