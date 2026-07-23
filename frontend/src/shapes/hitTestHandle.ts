import type { Camera, Point } from '../types/Types'
import { getResizeHandles, type ResizeHandlePosition } from '../selection/getResizeHandles'
import { getSelectionBounds } from '../selection/getSelectionBounds'
import type { Rectangle } from './Rectangle'
import { HANDLE_SIZE, type ResizeHandle } from '../types/selection'

export function hitTestHandle(
  point: Point,
  handles: ResizeHandlePosition[],
): ResizeHandle | null {

  for (const handle of handles) {
    if (
      point.x >= handle.x - HANDLE_SIZE / 2 &&
      point.x <= handle.x + HANDLE_SIZE / 2 &&
      point.y >= handle.y - HANDLE_SIZE / 2 &&
      point.y <= handle.y + HANDLE_SIZE / 2
    ) {
      return handle.type
    }
  }

  return null
}