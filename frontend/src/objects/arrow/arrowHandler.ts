import type { ObjectProperty } from "../properties/ObjectProperty";
import type { ObjectHandler } from "../registry/ObjectHandler";
import type { Arrow } from "./Arrow";
import { createArrow } from "./createArrow";
import { duplicateArrow } from "./duplicateArrow";
import { getArrowBounds } from "./getArrowBounds";
import { getArrowMoveUpdates } from "./getArrowMoveUpdates";
import { getArrowResizeUpdates } from "./getArrowResizeUpdates";
import { getResizeHandleArrow } from "./getResizeHandleArrow";
import { hitTestArrow } from "./hitTestArrow";
import { moveArrow } from "./moveArrow";
import { normalizeArrow } from "./normalizeArrow";
import { renderArrow } from "./renderArrow";
import { resizeArrow } from "./resizeArrow";
import { updateArrowPreview } from "./updateArrowPreview";

const arrowProperties: ObjectProperty<Arrow>[] = [
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

export const arrowHandler: ObjectHandler<Arrow> = {
    create: createArrow,
    move: moveArrow,
    resize: resizeArrow,
    render: renderArrow,
    hitTest: hitTestArrow,
    updatePreview: updateArrowPreview,
    getBounds: getArrowBounds,
    getResizeHandle: getResizeHandleArrow,
    getMoveUpdates: getArrowMoveUpdates,
    getResizeUpdates: getArrowResizeUpdates,
    duplicate: duplicateArrow,
    normalize: normalizeArrow,
    properties: arrowProperties,
}