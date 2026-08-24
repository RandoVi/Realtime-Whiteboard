import type { Camera } from "../../camera/Camera";
import type { Point } from "@common/types";
import type { ResizeHandle } from "../../types/selection";

import { getResizeHandles } from "./getResizeHandles";
import { hitTestHandle } from "../../objects/hitTestHandle";
import type { SelectionBounds } from "./getSelectionBounds";

export function hitTestResizeHandles(
    bounds: SelectionBounds,
    pointer: Point,
    camera: Camera,
    handleTypes: ResizeHandle[] = [
        "nw",
        "ne",
        "sw",
        "se",
    ],
): ResizeHandle | null {

    const handles =
        getResizeHandles(
            bounds,
            camera,
            handleTypes,
        );

    return hitTestHandle(
        pointer,
        handles,
    );
}