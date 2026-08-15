import type { Rectangle } from '@common/shapes'

export function normalizeRectangle(rectangle: Rectangle): Rectangle {
    let { x, y, width, height } = rectangle

    if (width < 0) {
        x += width
        width = Math.abs(width)
    }

    if (height < 0) {
        y += height
        height = Math.abs(height)
    }

    return { ...rectangle, x, y, width, height }
}