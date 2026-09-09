import type { ObjectProperty } from "../properties/ObjectProperty";

import { moveTriangle } from "./moveTriangle";
import { createTriangle } from "./createTriangle";
import { resizeTriangle } from "./resizeTriangle";
import { renderTriangle } from "./renderTriangle";
import type { ObjectHandler } from "../registry/ObjectHandler";
import type { Triangle } from "@common/shapes";
import { hitTestTriangle } from "./hitTestTriangle";
import { normalizeTriangle } from "./normalizeTriangle";
import { getTriangleBounds } from "./getTriangleBounds";
import { getTriangleMoveUpdates } from "./getTriangleMoveUpdates";
import { getTriangleResizeUpdates } from "./getTriangleResizeUpdates";
import { getResizeHandleTriangle } from "./getResizeHandleTriangle";
import { updateTrianglePreview } from "./updateTrianglePreview";
import { duplicateTriangle } from "./duplicateTriangle";




const triangleProperties: ObjectProperty<Triangle>[] = [
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
    {
        key: "strokeWidth",
        label: "Width",
        type: "number",
        section: "appearance",
        min: 1,
        max: 20,
        editable: true,
    },
];

export const triangleHandler: ObjectHandler<Triangle> = {
    create: createTriangle,
    move: moveTriangle, 
    resize: resizeTriangle,
    render: renderTriangle,
    hitTest: hitTestTriangle,
    normalize: normalizeTriangle,
    updatePreview: updateTrianglePreview,
    getBounds: getTriangleBounds,
    getResizeHandle: getResizeHandleTriangle,
    getMoveUpdates: getTriangleMoveUpdates,
    getResizeUpdates: getTriangleResizeUpdates,
    duplicate: duplicateTriangle,
    properties: triangleProperties,
}