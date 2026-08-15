import type { Triangle } from "@common/shapes";

export function normalizeTriangle(triangle: Triangle): Triangle {
    let { x, y, width, height } = triangle

    if (width < 0) {
        x += width
        width = Math.abs(width)
    }

    if (height < 0) {
        y += height
        height = Math.abs(height)
    }

    return { ...triangle, x, y, width, height }
}