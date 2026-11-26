import type { MutableRefObject } from "react";
import type { PresenceCommand } from "@common/commands";
import type { Interaction } from "../interaction/Interaction";
import type { Presence } from "../network/presence/Presence";
import type { RemotePresence } from "../network/presence/RemotePresence";
import { getOrCreateRemotePresence } from "../network/presence/getOrCreateRemotePresence";
import type { PreviewData } from "../rendering/renderObjects";

type Args = {
  userId: string;
  command: PresenceCommand;
  remotePresence: Map<string, RemotePresence>;
  interactionRef: MutableRefObject<Interaction>;
  selectedObjectIdsRef: MutableRefObject<string[]>;
  setSelectedObjectIds: (ids: string[]) => void;
  selectedObjectIdRef: MutableRefObject<string | null>;
  setSelectedObjectId: (id: string | null) => void;
  presence: Presence;
  requestRender: () => void;
  onCursorMove: () => void;
};

export function handleRemotePresenceCommand({
  userId,
  command,
  remotePresence,
  interactionRef,
  selectedObjectIdsRef,
  setSelectedObjectIds,
  selectedObjectIdRef,
  setSelectedObjectId,
  presence,
  requestRender,
  onCursorMove,
}: Args): void {
  switch (command.type) {
    case "cursorMovement": {
      const userPresence = getOrCreateRemotePresence(remotePresence, userId);
      userPresence.cursor = command.point;
      onCursorMove();
      break;
    }

    case "objectPreview": {
      const userPresence = getOrCreateRemotePresence(remotePresence, userId);

      if (command.previewType === "create") {
        userPresence.preview = {
          type: "create",
          object: command.boardObject,
        };
      }

      if (command.previewType === "update") {
        for (const objectPreview of command.objects) {
          if (objectPreview.boardObjectId === selectedObjectIdRef.current) {
            selectedObjectIdRef.current = null;
            setSelectedObjectId(null);
          }

          const preview: PreviewData = {
            type: "update",
            objectId: objectPreview.boardObjectId,
            updates: objectPreview.updates,
          };

          const existingIndex = userPresence.previews.findIndex(
            existingPreview =>
              existingPreview.type === "update" &&
              existingPreview.objectId === objectPreview.boardObjectId,
          );

          if (existingIndex === -1) {
            userPresence.previews.push(preview);
          } else {
            userPresence.previews[existingIndex] = preview;
          }
        }

        userPresence.preview = userPresence.previews[userPresence.previews.length - 1];
      }

      if (command.previewType === "clear") {
        userPresence.preview = undefined;
        userPresence.previews = [];
      }

      requestRender();
      break;
    }

    case "selection": {
      const interaction = interactionRef.current;
      const remoteSelectedIds = command.objectIds;
      const conflictingIds = remoteSelectedIds.filter(id =>
        selectedObjectIdsRef.current.includes(id),
      );

      if (conflictingIds.length > 0) {
        const nextSelectedIds = selectedObjectIdsRef.current.filter(
          id => !remoteSelectedIds.includes(id),
        );

        selectedObjectIdsRef.current = nextSelectedIds;
        setSelectedObjectIds(nextSelectedIds);

        if (
          selectedObjectIdRef.current &&
          remoteSelectedIds.includes(selectedObjectIdRef.current)
        ) {
          const nextPrimaryId = nextSelectedIds[0] ?? null;
          selectedObjectIdRef.current = nextPrimaryId;
          setSelectedObjectId(nextPrimaryId);
        }

        if (
          interaction.type === "moving" &&
          interaction.objectIds.some(id => remoteSelectedIds.includes(id))
        ) {
          interactionRef.current = { type: "idle" };
        }

        if (
          interaction.type === "resizing" &&
          remoteSelectedIds.includes(interaction.objectId)
        ) {
          interactionRef.current = { type: "idle" };
        }

        presence.send({
          type: "selection",
          objectIds: nextSelectedIds,
        });
      }

      const userPresence = getOrCreateRemotePresence(remotePresence, userId);
      userPresence.selectedObjectIds = remoteSelectedIds;
      requestRender();
      break;
    }

    case "laser": {
      const userPresence = getOrCreateRemotePresence(remotePresence, userId);

      if (command.laserType === "create") {
        userPresence.lasers.push(command.laser);
      }

      if (command.laserType === "point") {
        const laser = userPresence.lasers.find(item => item.id === command.laserId);
        if (!laser) {
          break;
        }

        laser.points.push({
          point: command.point,
          createdAt: performance.now(),
        });
      }

      requestRender();
      break;
    }
  }
}
