import type { Camera } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import type { Shape } from '../types/Shape'
import { renderRectangle } from './RenderRectangle'

export type PreviewPosition = {
  x: number;
  y: number;
};

export function renderShapes(
  context: CanvasRenderingContext2D,
  shapes: Shape[],
  camera: Camera,
  interaction: Interaction,
  remotePreviews: Map<string, PreviewPosition>
) {
  for (const shape of shapes) {
    if (remotePreviews.has(shape.id)) {
        continue;
    }

    renderShape(context, shape, camera)
  }

  if (interaction.type === "drawingShape") {
    renderShape(
      context,
      interaction.preview,
      camera
    )
  }

  for (const [id, position] of remotePreviews) {

    const shape = shapes.find(
      shape => shape.id === id
    );

    if (!shape) continue;


    renderShape(
      context,
      {
        ...shape,
        x: position.x,
        y: position.y,
      },
      camera
    );
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