import type { BoardObject } from "@common/types";
import type { Laser } from "@common/shapes";
import type { Camera } from "../camera/Camera";
import type { Interaction } from "../interaction/Interaction";
import type { RemotePresence } from "../network/presence/RemotePresence";
import { getUserById } from "../network/presence/getUserById";
import { getObjectById } from "../objects/getObjectById";
import { getRenderedObject } from "../objects/getRenderedObjects";
import { normalizeObject } from "../objects/normalizeObject";
import { getObjectHandler } from "../objects/registry/getObjectHandler";
import { renderBackground } from "../rendering/renderBackground";
import { renderGrid } from "../rendering/renderGrid";
import { renderObjects } from "../rendering/renderObjects";
import { renderSelection } from "../rendering/renderSelection";
import { renderSelectionRectangle } from "../rendering/renderSelectionRectangle";
import type { BoardUser } from "../types/BoardUser";

type SceneArgs = {
  context: CanvasRenderingContext2D;
  camera: Camera;
  viewport: { width: number; height: number; dpr: number };
  objects: BoardObject[];
  interaction: Interaction;
  remotePresence: Map<string, RemotePresence>;
  localLasers: Laser[];
};

type OverlayArgs = {
  context: CanvasRenderingContext2D;
  camera: Camera;
  objects: BoardObject[];
  users: BoardUser[];
  interaction: Interaction;
  remotePresence: Map<string, RemotePresence>;
  selectedObjectIds: string[];
  selectedObjectId: string | null;
  selectionColor?: string;
};

export function renderWhiteboardScene({
  context,
  camera,
  viewport,
  objects,
  interaction,
  remotePresence,
  localLasers,
}: SceneArgs): ReturnType<typeof renderObjects> {
  const { width, height, dpr } = viewport;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  renderBackground(context, { width, height });
  renderGrid(context, camera, { width, height });

  return renderObjects(
    context,
    objects,
    camera,
    interaction,
    remotePresence,
    localLasers,
  );
}

export function renderWhiteboardOverlays({
  context,
  camera,
  objects,
  users,
  interaction,
  remotePresence,
  selectedObjectIds,
  selectedObjectId,
  selectionColor,
}: OverlayArgs): void {
  if (interaction.type === "selecting") {
    renderSelectionRectangle(
      context,
      interaction.start,
      interaction.current,
      camera,
    );
  }

  if (selectionColor && interaction.type === "drawing") {
    // Use the geometry finishDrawing will save without changing the live preview.
    const preview = normalizeObject({ ...interaction.preview });
    if (getObjectHandler(preview).getBounds) {
      renderSelection(context, preview, camera, selectionColor, false);
    }
  }

  if (selectionColor && interaction.type !== "drawing") {
    for (const id of selectedObjectIds) {
      const object = getObjectById(objects, id);
      if (!object) {
        continue;
      }

      let renderedObject = object;

      if (interaction.type === "moving") {
        const preview = interaction.preview.find(item => item.id === object.id);
        if (preview) {
          renderedObject = preview;
        }
      }

      if (
        (interaction.type === "resizing" || interaction.type === "rotating") &&
        interaction.preview.id === object.id
      ) {
        renderedObject = interaction.preview;
      }

      for (const presence of remotePresence.values()) {
        const previewedObject = getRenderedObject(object, presence);
        if (previewedObject !== object) {
          renderedObject = previewedObject;
          break;
        }
      }

      renderSelection(
        context,
        renderedObject,
        camera,
        selectionColor,
        object.id === selectedObjectId,
      );
    }
  }

  for (const [userId, presence] of remotePresence) {
    const user = getUserById(users, userId);
    if (!user) {
      continue;
    }

    if (presence.preview?.type === "create") {
      const preview = normalizeObject({ ...presence.preview.object });
      if (getObjectHandler(preview).getBounds) {
        renderSelection(context, preview, camera, user.color, false);
      }
    }

    for (const objectId of presence.selectedObjectIds) {
      const object = getObjectById(objects, objectId);
      if (!object) {
        continue;
      }

      renderSelection(
        context,
        getRenderedObject(object, presence),
        camera,
        user.color,
        false,
      );
    }
  }

}
