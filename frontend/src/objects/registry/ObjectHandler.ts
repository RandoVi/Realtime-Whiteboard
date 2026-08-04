import type { SelectionBounds } from "../../selection/getSelectionBounds"
import type { Object } from "../../types/Object"
import type { Camera, Point } from "../../types/Types"
import type { ResizeHandle } from "../../types/selection"
import type { ObjectProperty } from "../properties/ObjectProperty"

export interface ObjectHandler<T extends Object = Object> {

    create?: (
        point: Point
    ) => T

    move?: (
        object: T,
        original: T,
        dx: number,
        dy: number
    ) => void

    resize?: (
        object: T,
        original: T,
        handle: ResizeHandle,
        point: Point
    ) => void

    render?: (
        context: CanvasRenderingContext2D,
        object: T,
        camera: any
    ) => void

    hitTest?: (
        point: Point,
        object: T
    ) => boolean

    normalize?: (
        object: T
    ) => T

    updatePreview?: (
        object: T,
        start: Point,
        current: Point
    ) => void

    getBounds?: (
        object: T
    ) => SelectionBounds

    getResizeHandle?: (
        object: T,
        point: Point,
        camera: Camera
    ) => ResizeHandle | null

    getMoveUpdates?: (
        object: T
    ) => Partial<T>

    getResizeUpdates?: (
        object: T
    ) => Partial<T>

    duplicate?: (
        object: T
    ) => T

    properties?: ObjectProperty<T>[]
}