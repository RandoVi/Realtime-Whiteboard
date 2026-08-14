import type { Arrow } from "@common/shapes"

export function normalizeArrow(rect: Arrow): Arrow {
    let { x, y, width, height } = rect

    if (width < 0) {
        x += width
        width = Math.abs(width)
    }

    if (height < 0) {
        y += height
        height = Math.abs(height)
    }

    return { ...rect, x, y, width, height }
}