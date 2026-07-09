import type { Camera } from '../Types'
import type { Shape } from '../shapes/Shape'
import { renderRectangle } from './RenderRectangle'

export function renderShapes(
  context: CanvasRenderingContext2D,
  shapes: Shape[],
  camera: Camera,
  previewShape?: Shape | null,
) {
  for (const shape of shapes) {
    renderShape(context, shape, camera)
  }

  if (previewShape) {
    renderShape(context, previewShape, camera)
  }
}

function renderShape(
  context: CanvasRenderingContext2D,
  shape: Shape,
  camera: Camera,
) {
  switch (shape.type) {
    case 'rectangle':
      renderRectangle(context, shape, camera)
      break

    default:
      console.warn(`Unknown shape type: ${shape.type}`)
  }
}