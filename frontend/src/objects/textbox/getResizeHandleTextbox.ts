import type { Camera, Point } from "../../types/Types"
import type { ResizeHandle } from "../../types/selection"
import { hitTestResizeHandles } from "../../selection/hitTestResizeHandles"
import { getTextboxBounds } from "./getTextboxBounds"
import type { Textbox } from "./Textbox"

export function getResizeHandleTextbox(
    object: Textbox,
    point: Point,
    camera: Camera
): ResizeHandle | null {

    return hitTestResizeHandles(
        getTextboxBounds(object),
        point,
        camera
    )
}