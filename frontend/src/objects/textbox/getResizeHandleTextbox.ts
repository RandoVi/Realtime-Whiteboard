import type { Camera } from "../../camera/Camera"
import type { ResizeHandle } from "../../types/selection"
import { hitTestResizeHandles } from "../../interaction/selection/hitTestResizeHandles"
import { getTextboxBounds } from "./getTextboxBounds"
import type { Textbox } from "@common/shapes/Textbox";
import type { Point } from "@common/types";

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