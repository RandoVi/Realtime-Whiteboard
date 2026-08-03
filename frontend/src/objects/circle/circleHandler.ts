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


export const circleHandler: ObjectHandler<Circle> = {
  create: createCircle,
  move: moveCircle,
  resize: resizeCircle,
  render: renderCircle,
  hitTest: hitTestCircle,
  updatePreview: updateCirclePreview,
  getBounds: getCircleBounds,
  getResizeHandle: getResizeHandleCircle,
}