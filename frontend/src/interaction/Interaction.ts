import type { Point } from '../types/Types'
import type { Shape } from '../types/Shape'
import type { Rectangle } from '../shapes/Rectangle'
import type { ResizeHandle } from '../types/selection'

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
        moved: boolean
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