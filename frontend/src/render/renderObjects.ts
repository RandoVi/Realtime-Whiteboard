import type { Camera } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import type { Object } from '../types/Object'
import { getObjectHandler } from '../objects/registry/getObjectHandler'
import type { RemotePresence } from '../socket/preview/RemotePresence';


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
  remotePresence: Map<string, RemotePresence>
): {
  hasAnimatedObjects: boolean;
  finishedObjects: Object[];
} {

  let hasAnimatedObjects = false;
  const finishedObjects: Object[] = [];

  for (const object of objects) {

    const isPreviewed = Array.from(
      remotePresence.values()
    ).some(
      presence =>
        presence.preview?.type === "update" &&
        presence.preview.objectId === object.id
    );

    if (isPreviewed) {
      continue;
    }

    renderObject(context, object, camera);
    const handler = getObjectHandler(object);

    if (handler.isAnimated?.(object)) {
      hasAnimatedObjects = true;
    }

    if (handler.isFinished?.(object)) {
      finishedObjects.push(object);
    }
  }

  if (interaction.type === "drawing") {
    renderObject(
      context,
      interaction.preview,
      camera
    )
  }

  for (const [userId, presence] of remotePresence) {
    console.log(
      "RENDER PRESENCE",
      userId,
      presence
    );

    const preview = presence.preview;

    if (!preview) {
      continue;
    }

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
        } as Object,
        camera
      );
    }
  }
  return {
    hasAnimatedObjects,
    finishedObjects,
  };
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