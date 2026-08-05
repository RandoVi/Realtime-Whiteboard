import type { Triangle } from './Triangle'
import type { Point } from '../../types/Types'
import type { ResizeHandle } from '../../types/selection'

export function resizeTriangle(
    triangle: Triangle,
    original: Triangle,
    handle: ResizeHandle,
    point: Point
) {
    switch (handle) {

        case 'se':
            triangle.width =
                point.x - original.x

            triangle.height =
                point.y - original.y

            break


        case 'sw':
            triangle.x = point.x

            triangle.width =
                original.x + original.width - point.x

            triangle.height =
                point.y - original.y

            break


        case 'ne':
            triangle.y = point.y

            triangle.width =
                point.x - original.x

            triangle.height =
                original.y + original.height - point.y

            break


        case 'nw':
            triangle.x = point.x
            triangle.y = point.y

            triangle.width =
                original.x + original.width - point.x

            triangle.height =
                original.y + original.height - point.y

            break
    }
}