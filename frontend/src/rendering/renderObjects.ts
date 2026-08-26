import type { Camera } from "../camera/Camera";
import type { Interaction } from '../interaction/Interaction'
import type { BoardObject } from '@common/types'
import type { Laser } from '@common/shapes/Laser'
import { getObjectHandler } from '../objects/registry/getObjectHandler'
import type { RemotePresence } from '../network/presence/RemotePresence';

import { renderLaser } from "../objects/laser/renderLaser";
import { getRenderedObject } from "../objects/getRenderedObjects";


export type PreviewData =
  | {
    type: "update";
    objectId: string;
    updates: Partial<BoardObject>;
  }
  | {
    type: "create";
    object: BoardObject;
  };

export function renderObjects(
  context: CanvasRenderingContext2D,
  objects: BoardObject[],
  camera: Camera,
  interaction: Interaction,
  remotePresence: Map<string, RemotePresence>,
  localLasers: Laser[],
): {
  hasAnimatedObjects: boolean;
  finishedObjects: BoardObject[];
  finishedLocalLasers: Laser[];
  finishedRemoteLasers: {
    userId: string;
    laser: Laser;
  }[];
} {

  let hasAnimatedObjects = false;

  const finishedObjects: BoardObject[] = [];

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
    if (interaction.type === "moving") {
      const preview = interaction.preview.find(
        preview => preview.id === object.id
      );

      if (preview) {
        renderObject(
          context,
          preview,
          camera,
        );

        continue;
      }
    }

    // LOCAL resizing / rotating preview
    if (
      (
        interaction.type === "resizing" ||
        interaction.type === "rotating"
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


    // REMOTE moving preview, all objects currently being remotely previewed are hidden from the committed layer
    const isPreviewed = Array.from(
      remotePresence.values()
    ).some(
      presence =>
        presence.previews.some(
          preview =>
            preview.type === "update" &&
            preview.objectId === object.id
        )
    );

    if (isPreviewed) {
      // console.log(
      //   "REMOTE PREVIEW HIDING COMMITTED OBJECT",
      //   {
      //     objectId: object.id,
      //     object,
      //     remotePreviews: Array.from(remotePresence.entries()),
      //   }
      // );
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

    // REMOTE object creation preview
    if (
      presence.preview?.type === "create"
    ) {
      renderObject(
        context,
        presence.preview.object,
        camera,
      );
    }

    // REMOTE object update previews
    for (const preview of presence.previews) {

      if (preview.type !== "update") {
        continue;
      }

      const object = objects.find(
        object => object.id === preview.objectId
      );

      if (!object) {
        continue;
      }

      const renderedObject = getRenderedObject(
        object,
        {
          ...presence,
          preview,
        },
      );

      renderObject(
        context,
        renderedObject,
        camera,
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
  object: BoardObject,
  camera: Camera,
) {
  getObjectHandler(object)
    .render?.(
      context,
      object,
      camera,
    )
}