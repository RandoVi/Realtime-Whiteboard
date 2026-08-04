import type { Camera } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import type { Object } from '../types/Object'
import { getObjectHandler } from '../objects/registry/getObjectHandler'

export type PreviewData =
  | {
    type: "update";
    objectId: string;
    updates: Partial<Object>;
  }
  | {
    type: "create";
    object: Object;
  };

export function renderObjects(
  context: CanvasRenderingContext2D,
  objects: Object[],
  camera: Camera,
  interaction: Interaction,
  remotePreviews: Map<string, PreviewData>
) {
  for (const object of objects) {
    if (remotePreviews.has(object.id)) {
      continue;
    }

    renderObject(context, object, camera)
  }

  if (interaction.type === "drawing") {
    renderObject(
      context,
      interaction.preview,
      camera
    )
  }

  for (const preview of remotePreviews.values()) {

    if (preview.type === "create") {

      renderObject(
        context,
        preview.object,
        camera
      );

      continue;
    }


    if (preview.type === "update") {

      const object = objects.find(
        object => object.id === preview.objectId
      );

      if (!object) continue;


      renderObject(
        context,
        {
          ...object,
          ...preview.updates,
        } as Object, //temporary cast to Object, since we know that the updates will be valid for the object type
        camera
      );
    }
  }
}

function renderObject(
  context: CanvasRenderingContext2D,
  object: Object,
  camera: Camera,
) {
  getObjectHandler(object)
    .render?.(
      context,
      object,
      camera,
    )
}