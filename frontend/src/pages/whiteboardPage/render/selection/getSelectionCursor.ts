import type { ResizeHandle } from "../../tools/selection"

export function getSelectionCursor(
  handle: ResizeHandle | null
): string {

  switch (handle) {
    case 'nw':
    case 'se':
      return 'nwse-resize'

    case 'ne':
    case 'sw':
      return 'nesw-resize'

    default:
      return 'grab'
  }
}