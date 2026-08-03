import type { ObjectHandler } from "../registry/ObjectHandler"

import { createCircle } from "./createCircle"
import { moveCircle } from "./moveCircle"
import { resizeCircle } from "./resizeCircle"
import { renderCircle } from "./renderCircle"
import { hitTestCircle } from "./hitTestCircle"
import { updateCirclePreview } from "./updateCirclePreview"
import type { Circle } from "./Circle"
import { getCircleBounds } from "./getCircleBounds"
import { getResizeHandleCircle } from "./getResizeHandleCircle"
import { getCircleResizeUpdates } from "./getCircleResizeUpdates"
import { getCircleMoveUpdates } from "./getCircleMoveUpdates"
import type { ObjectProperty } from "../properties/ObjectProperty"

const circleProperties: ObjectProperty<Circle>[] = [
  {
    key: "x",
    label: "X",
    type: "number",
  },
  {
    key: "y",
    label: "Y",
    type: "number",
  },
  {
    key: "radius",
    label: "Radius",
    type: "number",
  },
  {
    key: "fill",
    label: "Fill",
    type: "color",
  },
]

export const circleHandler: ObjectHandler<Circle> = {
    create: createCircle,
    move: moveCircle,
    resize: resizeCircle,
    render: renderCircle,
    hitTest: hitTestCircle,
    updatePreview: updateCirclePreview,
    getBounds: getCircleBounds,
    getResizeHandle: getResizeHandleCircle,
    getMoveUpdates: getCircleMoveUpdates,
    getResizeUpdates: getCircleResizeUpdates,
    properties: circleProperties,
}