import type { CanvasText, Textbox } from "@common/shapes";
import type { Point } from "@common/types";
import type { ResizeHandle } from "../types/selection";
import { inverseRotatePoint } from "../interaction/helpers/rotatePoint";
import { getMinimumTextSize } from "./getMinimumTextSize";

type TextObject = CanvasText | Textbox;

export function resizeTextBoxLikeObject<T extends TextObject>(
    object: T,
    original: T,
    handle: ResizeHandle,
    point: Point,
    constrain: boolean,
) {
    const center = {
        x: original.x + original.width / 2,
        y: original.y + original.height / 2,
    };

    const local = inverseRotatePoint(
        point,
        center,
        original.rotation,
    );

    const right = original.x + original.width;
    const bottom = original.y + original.height;

    const rawWidth =
        handle === "nw" || handle === "sw"
            ? right - local.x
            : local.x - original.x;

    const rawHeight =
        handle === "nw" || handle === "ne"
            ? bottom - local.y
            : local.y - original.y;

    const minimumWidth = getMinimumTextSize(
        original,
        original.width,
    ).width;

    let width = Math.max(rawWidth, minimumWidth);
    let height = Math.max(
        rawHeight,
        getMinimumTextSize(original, width).height,
    );

    if (constrain) {
        const side = Math.max(width, height);
        width = side;
        height = side;
    }

    object.width = width;
    object.height = height;

    object.x =
        handle === "nw" || handle === "sw"
            ? right - width
            : original.x;

    object.y =
        handle === "nw" || handle === "ne"
            ? bottom - height
            : original.y;
}