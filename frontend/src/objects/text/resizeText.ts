import type { CanvasText } from "@common/shapes/CanvasText";
import type { Point } from "@common/types";
import type { ResizeHandle } from "../../types/selection";
import { resizeTextBoxLikeObject } from "../resizeTextBoxLikeObject";

export function resizeText(
    text: CanvasText,
    original: CanvasText,
    handle: ResizeHandle,
    point: Point,
    constrain: boolean,
) {
    resizeTextBoxLikeObject(
        text,
        original,
        handle,
        point,
        constrain,
    );
}