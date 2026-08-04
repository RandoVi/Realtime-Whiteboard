import type { ObjectProperty } from "../properties/ObjectProperty"
import type { ObjectHandler } from "../registry/ObjectHandler"
import { createStroke } from './createStroke'
import { getStrokeMoveUpdates } from "./getStrokeMoveUpdates"
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
    updatePreview: updateStrokePreview,
    getMoveUpdates: getStrokeMoveUpdates,
    properties: strokeProperties,
}