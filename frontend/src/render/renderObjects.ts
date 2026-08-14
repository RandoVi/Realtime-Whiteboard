import type { Camera } from '../types/Types'
import type { Interaction } from '../interaction/Interaction'
import type { Object} from '@common/types'
import type {Laser} from '@common/shapes/Laser'
import { getObjectHandler } from '../objects/registry/getObjectHandler'
import type { RemotePresence } from '../socket/preview/RemotePresence';
import { getRenderedObject } from '../objects/getRenderedObjects';

import { renderLaser } from "../objects/laser/renderLaser";


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
  remotePresence: Map<string, RemotePresence>,
  localLasers: Laser[],
): {
  hasAnimatedObjects: boolean;
  finishedObjects: Object[];
  finishedLocalLasers: Laser[];
  finishedRemoteLasers: {
    userId: string;
    laser: Laser;
  }[];
} {

  let hasAnimatedObjects = false;

  const finishedObjects: Object[] = [];

  const finishedLocalLasers: Laser[] = [];

  const finishedRemoteLasers: {
    userId: string;
    laser: Laser;
  }[] = [];

  for (const object of objects) {

    // Don't render the committed textbox while
    // its HTML textarea editor is visible.
    const isLocalEditing =
      interaction.type === "textEditing" &&
      interaction.objectId === object.id;

    if (isLocalEditing) {
      continue;
    }


    // LOCAL moving preview
    if (
      (
        interaction.type === "moving" ||
        interaction.type === "resizing"
      ) &&
      interaction.preview.id === object.id
    ) {

      if (object.type === "textbox") {
        console.log(
          "RENDER TEXTBOX:",
          object.id,
          JSON.stringify(object.text)
        );
      }
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

  for (const laser of localLasers) {

    const active = renderLaser(
      context,
      laser,
      camera,
    );

    if (active) {
      hasAnimatedObjects = true;
    } else {
      finishedLocalLasers.push(laser);
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

    for (const laser of presence.lasers) {

      const active = renderLaser(
        context,
        laser,
        camera,
      );

      if (active) {
        hasAnimatedObjects = true;
      } else {
        finishedRemoteLasers.push({
          userId,
          laser,
        });
      }
    }

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
    finishedLocalLasers,
    finishedRemoteLasers,
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