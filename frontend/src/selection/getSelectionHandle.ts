import type { Camera } from '../types/Types'
import type { Object } from '@common/types'
import type { Point } from '@common/types'
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