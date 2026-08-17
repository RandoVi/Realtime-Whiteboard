import type { Point } from "@common/types";
import type { ResizeHandlePosition } from '../interaction/selection/getResizeHandles'

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