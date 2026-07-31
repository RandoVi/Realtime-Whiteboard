import type { Camera } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import type { Shape } from '../types/Shape'
import { renderRectangle } from './RenderRectangle'

export type PreviewData =
  | {
    type: "update";
    shapeId: string;
    updates: Partial<Shape>;
  }
  | {
    type: "create";
    shape: Shape;
  };

export function renderShapes(
  context: CanvasRenderingContext2D,
  shapes: Shape[],
  camera: Camera,
  interaction: Interaction,
  remotePreviews: Map<string, PreviewData>
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

  for (const preview of remotePreviews.values()) {

    if (preview.type === "create") {

      renderShape(
        context,
        preview.shape,
        camera
      );

      continue;
    }


    if (preview.type === "update") {

      const shape = shapes.find(
        shape => shape.id === preview.shapeId
      );

      if (!shape) continue;


      renderShape(
        context,
        {
          ...shape,
          ...preview.updates,
        },
        camera
      );
    }
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