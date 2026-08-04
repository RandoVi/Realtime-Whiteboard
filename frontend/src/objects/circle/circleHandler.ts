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
    key: "radius",
    label: "Radius",
    type: "number",
    section: "transform",
    min: 1,
    editable: true,
  },
  {
    key: "fill",
    label: "Fill",
    type: "color",
    section: "appearance",
    editable: true,
  },
];

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