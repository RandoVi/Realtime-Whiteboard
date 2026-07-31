import type { Point } from '../types/Types'
import type { Object } from '../types/Object'
import type { Rectangle } from '../objects/Rectangle'
import type { ResizeHandle } from '../types/selection'

export type Interaction =

    | { type: 'idle' }

    | {
        type: 'drawingObject'
        start: Point
        preview: Object
    }

    | {
        type: 'movingObject'
        start: Point
        original: Object
        objectId: string
        moved: boolean
    }

    | {
        type: 'resizingObject'
        objectId: string
        original: Rectangle
        handle: ResizeHandle
    }

    | {
        type: 'panning'
        start: Point
    }