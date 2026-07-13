import type { Camera, Point } from '../Types'
import { getResizeHandles, type ResizeHandlePosition } from '../render/selection/getResizeHandles'
import { getSelectionBounds } from '../render/selection/getSelectionBounds'
import type { Rectangle } from '../shapes/Rectangle'
import { HANDLE_SIZE, type ResizeHandle } from './selection'

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