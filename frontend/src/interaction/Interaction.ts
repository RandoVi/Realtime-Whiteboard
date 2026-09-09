import type { Point, BoardObject, RotatableObject } from "@common/types"
import type { ResizeHandle } from '../types/selection'

export type Interaction =

    | { type: 'idle' }

    | {
        type: 'selecting'
        start: Point
        current: Point
    }

    | {
        type: 'drawing'
        start: Point
        preview: BoardObject
    }

    | {
        type: 'moving'
        start: Point
        original: BoardObject[]
        preview: BoardObject[]
        objectIds: string[]
        moved: boolean
    }

    | {
        type: 'groupMoving'
        start: Point
        originals: BoardObject[]
        previews: BoardObject[]
        moved: boolean
    }

    | {
        type: 'resizing'
        objectId: string
        original: BoardObject
        preview: BoardObject
        handle: ResizeHandle
        offset: Point
    }
    | {
        type: 'rotating'
        objectId: string
        original: RotatableObject
        preview: RotatableObject
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