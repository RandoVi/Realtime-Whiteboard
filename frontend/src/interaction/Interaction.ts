import type { Point } from '../types/Types'
import type { Object } from '../types/Object'
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
        original: Object
        handle: ResizeHandle
        offset: Point
    }

    | {
        type: 'panning'
        start: Point
    }