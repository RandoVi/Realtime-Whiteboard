import type { ObjectProperty } from "../properties/ObjectProperty"
import type { ObjectHandler } from "../registry/ObjectHandler"
import { createStroke } from './createStroke'
import { duplicateStroke } from "./duplicateStroke"
import { getStrokeBounds } from "./getStrokeBounds"
import { getStrokeMoveUpdates } from "./getStrokeMoveUpdates"
import { hitTestStroke } from "./hitTestStroke"
import { moveStroke } from './moveStroke'
import { renderStroke } from './renderStroke'
import type { Stroke } from "./Stroke"
import { updateStrokePreview } from './updateStrokePreview'

const strokeProperties: ObjectProperty<Stroke>[] = [
    {
        key: "stroke",
        label: "Stroke",
        type: "color",
        section: "appearance",
        min: 1,
        max: 20,
        editable: true,
    },
];



export const strokeHandler: ObjectHandler<Stroke> = {
    create: createStroke,
    move: moveStroke,
    render: renderStroke,
    hitTest: hitTestStroke,
    updatePreview: updateStrokePreview,
    duplicate: duplicateStroke,
    getBounds: getStrokeBounds,
    getMoveUpdates: getStrokeMoveUpdates,
    properties: strokeProperties,
}