import type { SelectionBounds } from "../../selection/getSelectionBounds"
import type { Object, Point } from "@common/types"
import type { Camera } from "../../types/Types"
import type { ResizeHandle } from "../../types/selection"
import type { ObjectStyle } from "../ObjectStyle"
import type { ObjectProperty } from "../properties/ObjectProperty"

// Interface for handling different object types in the whiteboard application. 
// It defines methods for creating, moving, resizing, rendering, hit testing, 
// normalizing, updating previews, getting bounds, getting resize handles, 
// getting move and resize updates, duplicating objects, and managing object properties.
export interface ObjectHandler<T extends Object = Object> {

    create?: (
        point: Point,
        style: ObjectStyle
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
        point: Point,
        constrain: boolean,
    ) => void;

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

    isAnimated?: (
        object: T
    ) => boolean

    isFinished?: (
        object: T
    ) => boolean

    properties?: ObjectProperty<T>[]
}