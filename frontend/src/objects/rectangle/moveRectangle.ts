import type { Rectangle } from '@common/shapes'

export function moveRectangle(
    rectangle: Rectangle,
    original: Rectangle,
    dx: number,
    dy: number,
) {
    rectangle.x = original.x + dx;
    rectangle.y = original.y + dy;
}