import type { Point, Object } from "@common/types"
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
    | {
        type: 'laser'
        laserId: string
    }
    | {
        type: 'textEditing'
        objectId: string
    }