import type { Textbox } from "@common/shapes/Textbox"
import type { Point } from "@common/types";
import type { ResizeHandle } from "../../types/selection"
import { resizeTextBoxLikeObject } from "../resizeTextBoxLikeObject";

// Resizes a textbox based on the original dimensions, the handle being dragged, and the current mouse position.
// rotation is taken into account to ensure the resizing behaves correctly even when the textbox is rotated.
export function resizeTextbox(
    textbox: Textbox,
    original: Textbox,
    handle: ResizeHandle,
    point: Point,
    constrain: boolean,
) {
    resizeTextBoxLikeObject(
        textbox,
        original,
        handle,
        point,
        constrain,
    );
}


