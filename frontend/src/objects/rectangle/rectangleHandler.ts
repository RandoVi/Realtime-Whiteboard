import type { ObjectHandler } from "../registry/ObjectHandler"

import { createRectangle } from "./createRectangle"
import { moveRectangle } from "./moveRectangle"
import { resizeRectangle } from "./resizeRectangle"
import { renderRectangle } from "./renderRectangle"
import { hitTestRectangle } from "./hitTestRectangle"
import { normalizeRectangle } from "./normalizeRectangle"
import { updateRectanglePreview } from "./updateRectanglePreview"
import type { Rectangle } from "./Rectangle"
import { getRectangleBounds } from "./getRectangleBounds"
import { getResizeHandleRectangle } from "./getResizeHandleRectangle"

export const rectangleHandler: ObjectHandler<Rectangle> = {
  create: createRectangle,
  move: moveRectangle,
  resize: resizeRectangle,
  render: renderRectangle,
  hitTest: hitTestRectangle,
  normalize: normalizeRectangle,
  updatePreview: updateRectanglePreview,
  getBounds: getRectangleBounds,
  getResizeHandle: getResizeHandleRectangle,
}