import type { Camera } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import type { Object } from '../types/Object'
import { getObjectHandler } from '../objects/registry/getObjectHandler'
import type { RemotePresence } from '../socket/preview/RemotePresence';
import { getRenderedObject } from '../objects/getRenderedObjects';


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

  console.log(
    "RENDER INTERACTION",
    interaction
  );
  let hasAnimatedObjects = false;
  const finishedObjects: Object[] = [];

  for (const object of objects) {

    // LOCAL moving preview
    if (
      (
        interaction.type === "moving" ||
        interaction.type === "resizing"
      ) &&
      interaction.preview.id === object.id
    ) {
      renderObject(
        context,
        interaction.preview,
        camera,
      );

      continue;
    }


    // REMOTE moving preview
    const isPreviewed = Array.from(
      remotePresence.values()
    ).some(
      presence =>
        presence.preview?.type === "update" &&
        presence.preview.objectId === object.id
    );

    if (isPreviewed) {
      console.log(
        "REMOTE PREVIEW HIDING COMMITTED OBJECT",
        {
          objectId: object.id,
          object,
          remotePreviews: Array.from(remotePresence.entries()),
        }
      );
      continue;
    }


    // NORMAL committed object
    renderObject(
      context,
      object,
      camera
    );


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
        getRenderedObject(object, presence),
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