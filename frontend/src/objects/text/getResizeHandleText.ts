import type { CanvasText } from "@common/shapes/CanvasText";
import type { Point } from "@common/types";
import type { Camera } from "../../camera/Camera";
import type { ResizeHandle } from "../../types/selection";

import { hitTestResizeHandles } from "../../interaction/selection/hitTestResizeHandles";
import { getTextBounds } from "./getTextBounds";

export function getResizeHandleText(
    object: CanvasText,
    point: Point,
    camera: Camera,
): ResizeHandle | null {

    return hitTestResizeHandles(
        getTextBounds(object),
        point,
        camera,
        ["w", "e"],
    );
}