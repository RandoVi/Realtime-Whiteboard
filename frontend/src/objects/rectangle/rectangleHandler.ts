import type { ObjectHandler } from "../registry/ObjectHandler"

import { createRectangle } from "./createRectangle"
import { moveRectangle } from "./moveRectangle"
import { resizeRectangle } from "./resizeRectangle"
import { renderRectangle } from "./renderRectangle"
import { hitTestRectangle } from "./hitTestRectangle"
import { normalizeRectangle } from "./normalizeRectangle"
import { updateRectanglePreview } from "./updateRectanglePreview"
import type { Rectangle } from "./Rectangle"
import { getRectangleBounds } from "./getRectangleBounds"
import { getResizeHandleRectangle } from "./getResizeHandleRectangle"
import { getRectangleResizeUpdates } from "./getRectangleResizeUpdates"
import { getRectangleMoveUpdates } from "./getRectangleMoveUpdates"
import type { ObjectProperty } from "../properties/ObjectProperty"

const rectangleProperties: ObjectProperty<Rectangle>[] = [
    {
        key: "x",
        label: "X",
        type: "number",
        section: "transform",
        editable: false,
    },
    {
        key: "y",
        label: "Y",
        type: "number",
        section: "transform",
        editable: false,
    },
    {
        key: "width",
        label: "Width",
        type: "number",
        section: "transform",
        min: 1,
        editable: false,
    },
    {
        key: "height",
        label: "Height",
        type: "number",
        section: "transform",
        min: 1,
        editable: false,
    },
    {
        key: "fill",
        label: "Fill",
        type: "color",
        section: "appearance",
        editable: true,
    },
    {
        key: "stroke",
        label: "Stroke",
        type: "color",
        section: "appearance",
        editable: true,
    },
];

export const rectangleHandler: ObjectHandler<Rectangle> = {
    create: createRectangle,
    move: moveRectangle,
    resize: resizeRectangle,
    render: renderRectangle,
    hitTest: hitTestRectangle,
    normalize: normalizeRectangle,
    updatePreview: updateRectanglePreview,
    getBounds: getRectangleBounds,
    getResizeHandle: getResizeHandleRectangle,
    getMoveUpdates: getRectangleMoveUpdates,
    getResizeUpdates: getRectangleResizeUpdates,
    properties: rectangleProperties,
}


