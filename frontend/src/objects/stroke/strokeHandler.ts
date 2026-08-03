import type { ObjectHandler } from "../registry/ObjectHandler"
import { createStroke } from './createStroke'
import { moveStroke } from './moveStroke'
import { renderStroke } from './renderStroke'
import type { Stroke } from "./Stroke"
import { updateStrokePreview } from './updateStrokePreview'

export const strokeHandler: ObjectHandler<Stroke> = {
  create: createStroke,
  move: moveStroke,
  render: renderStroke,
  updatePreview: updateStrokePreview,
}