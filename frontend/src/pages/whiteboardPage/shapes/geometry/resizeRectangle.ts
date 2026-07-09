import type { Rectangle } from '../Rectangle'
import type { Point } from '../../Types'
import type { ResizeHandle } from '../../tools/selection'

export function resizeRectangle(
    rectangle: Rectangle,
    original: Rectangle,
    handle: ResizeHandle,
    point: Point
) {
    switch (handle) {

        case 'se':
            rectangle.width =
                point.x - original.x

            rectangle.height =
                point.y - original.y

            break


        case 'sw':
            rectangle.x = point.x

            rectangle.width =
                original.x + original.width - point.x

            rectangle.height =
                point.y - original.y

            break


        case 'ne':
            rectangle.y = point.y

            rectangle.width =
                point.x - original.x

            rectangle.height =
                original.y + original.height - point.y

            break


        case 'nw':
            rectangle.x = point.x
            rectangle.y = point.y

            rectangle.width =
                original.x + original.width - point.x

            rectangle.height =
                original.y + original.height - point.y

            break
    }
}