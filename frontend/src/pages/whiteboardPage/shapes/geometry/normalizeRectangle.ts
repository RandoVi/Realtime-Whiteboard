import type { Rectangle } from '../Rectangle'

export function normalizeRectangle(rect: Rectangle): Rectangle {
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