import type { CanvasText } from "@common/shapes/CanvasText";
import type { ObjectHandler } from "../registry/ObjectHandler";
import type { ObjectProperty } from "../properties/ObjectProperty";

import { createText } from "./createText";
import { duplicateText } from "./duplicateText";
import { getTextBounds } from "./getTextBounds";
import { getTextMoveUpdates } from "./getTextMoveUpdates";
import { hitTestText } from "./hitTestText";
import { moveText } from "./moveText";
import { renderText } from "./renderText";
import { updateTextPreview } from "./updateTextPreview";
import { getTextResizeUpdates } from "./getTextResizeUpdates";
import { getResizeHandleText } from "./getResizeHandleText";
import { resizeText } from "./resizeText";

const textProperties: ObjectProperty<CanvasText>[] = [
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
        key: "text",
        label: "Text",
        type: "text",
        section: "content",
        editable: true,
    },

    {
        key: "fontSize",
        label: "Font Size",
        type: "number",
        section: "text",
        min: 1,
        editable: true,
    },

    {
        key: "fontFamily",
        label: "Font",
        type: "select",
        section: "text",
        editable: true,
        options: [
            { value: "Inter", label: "Inter" },
            { value: "Arial", label: "Arial" },
            { value: "Georgia", label: "Georgia" },
            { value: "Verdana", label: "Verdana" },
            { value: "Times New Roman", label: "Times New Roman" },
            { value: "Playpen Sans", label: "Playpen Sans" },
            { value: "Elms Sans", label: "Elms Sans" },
            { value: "Story Script", label: "Story Script 400" },
            { value: "Kranky", label: "Kranky" },
        ],
    },

    {
        key: "fontWeight",
        label: "Weight",
        type: "select",
        section: "text",
        editable: true,
        options: [
            { value: 100, label: "Thin" },
            { value: 200, label: "Extra Light" },
            { value: 300, label: "Light" },
            { value: 400, label: "Normal" },
            { value: 500, label: "Medium" },
            { value: 600, label: "Semi Bold" },
            { value: 700, label: "Bold" },
            { value: 800, label: "Extra Bold" },
            { value: 900, label: "Black" },
        ],
    },

    {
        key: "fill",
        label: "Text",
        type: "color",
        section: "appearance",
        editable: true,
    },
];

export const textHandler: ObjectHandler<CanvasText> = {

    create: createText,

    move: moveText,

    resize: resizeText,

    render: renderText,

    hitTest: hitTestText,

    updatePreview: updateTextPreview,

    getBounds: getTextBounds,

    getResizeHandle: getResizeHandleText,

    getMoveUpdates: getTextMoveUpdates,

    getResizeUpdates: getTextResizeUpdates,

    duplicate: duplicateText,

    resizeHandles: ["w", "e"],

    properties: textProperties,
}