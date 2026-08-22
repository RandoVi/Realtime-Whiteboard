import type { ObjectHandler } from "../registry/ObjectHandler"
import type { ObjectProperty } from "../properties/ObjectProperty"
import { createTextbox } from "./createTextbox"
import { duplicateTextbox } from "./duplicateTextbox"
import { getResizeHandleTextbox } from "./getResizeHandleTextbox"
import { getTextboxBounds } from "./getTextboxBounds"
import { getTextboxMoveUpdates } from "./getTextboxMoveUpdates"
import { getTextboxResizeUpdates } from "./getTextboxResizeUpdates"
import { hitTestTextbox } from "./hitTestTextbox"
import { moveTextbox } from "./moveTextbox"
import { normalizeTextbox } from "./normalizeTextbox"
import { renderTextbox } from "./renderTextbox"
import { resizeTextbox } from "./resizeTextbox"
import { updateTextboxPreview } from "./updateTextboxPreview"
import type { Textbox } from "@common/shapes/Textbox";

const textboxProperties: ObjectProperty<Textbox>[] = [
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
            { value: "Kranky", label: "Kranky 400" },
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

    {
        key: "background",
        label: "Background",
        type: "color",
        section: "appearance",
        editable: true,
    },
];


export const textboxHandler: ObjectHandler<Textbox> = {

    create: createTextbox,

    move: moveTextbox,

    resize: resizeTextbox,

    render: renderTextbox,

    hitTest: hitTestTextbox,

    normalize: normalizeTextbox,

    updatePreview: updateTextboxPreview,

    getBounds: getTextboxBounds,

    getResizeHandle: getResizeHandleTextbox,

    getMoveUpdates: getTextboxMoveUpdates,

    getResizeUpdates: getTextboxResizeUpdates,

    duplicate: duplicateTextbox,

    properties: textboxProperties,
}