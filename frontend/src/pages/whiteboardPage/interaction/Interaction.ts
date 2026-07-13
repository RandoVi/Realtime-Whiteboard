import type { Point } from '../Types'
import type { Shape } from '../shapes/Shape'
import type { Rectangle } from '../shapes/Rectangle'
import type { ResizeHandle } from '../tools/selection'

export type Interaction =

    | { type: 'idle' }

    | {
        type: 'drawingShape'
        start: Point
        preview: Shape
    }

    | {
        type: 'movingShape'
        start: Point
        original: Shape
        shapeId: string
    }

    | {
        type: 'resizingShape'
        shapeId: string
        original: Rectangle
        handle: ResizeHandle
    }

    | {
        type: 'panning'
        start: Point
    }