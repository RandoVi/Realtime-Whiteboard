import type { ObjectHandler } from "../registry/ObjectHandler"
import type { ObjectProperty } from "../properties/ObjectProperty"
import type { Textbox } from "./Textbox"

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
        type: "text",
        section: "text",
        editable: true,
    },

    {
        key: "fontWeight",
        label: "Weight",
        type: "number",
        section: "text",
        min: 100,
        max: 900,
        editable: true,
    },

    {
        key: "fill",
        label: "Color",
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
]


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