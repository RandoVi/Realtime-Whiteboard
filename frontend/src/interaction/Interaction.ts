import type { Point } from '../types/Types'
import type { Object } from '../types/Object'
import type { ResizeHandle } from '../types/selection'

export type Interaction =

    | { type: 'idle' }

    | {
        type: 'drawing'
        start: Point
        preview: Object
    }

    | {
        type: 'moving'
        start: Point
        original: Object
        preview: Object
        objectId: string
        moved: boolean
    }

    | {
        type: 'resizing'
        objectId: string
        original: Object
        preview: Object
        handle: ResizeHandle
        offset: Point
    }

    | {
        type: 'panning'
        start: Point
    }