import { describe, expect, it, vi } from "vitest";
import type { Interaction } from "../interaction/Interaction";
import type { Presence } from "../network/presence/Presence";
import type { RemotePresence } from "../network/presence/RemotePresence";
import { handleRemotePresenceCommand } from "./handleRemotePresenceCommand";

function setup() {
  const remotePresence = new Map<string, RemotePresence>();
  const interactionRef = { current: { type: "idle" } as Interaction };
  const selectedObjectIdsRef = { current: ["first", "second"] };
  const selectedObjectIdRef = { current: "first" as string | null };
  const setSelectedObjectIds = vi.fn();
  const setSelectedObjectId = vi.fn();
  const send = vi.fn();
  const requestRender = vi.fn();
  const onCursorMove = vi.fn();

  const dependencies = {
    userId: "peer",
    remotePresence,
    interactionRef,
    selectedObjectIdsRef,
    setSelectedObjectIds,
    selectedObjectIdRef,
    setSelectedObjectId,
    presence: { send } as unknown as Presence,
    requestRender,
    onCursorMove,
  };

  return {
    dependencies,
    remotePresence,
    interactionRef,
    selectedObjectIdsRef,
    selectedObjectIdRef,
    setSelectedObjectIds,
    setSelectedObjectId,
    send,
    requestRender,
  };
}

describe("handleRemotePresenceCommand", () => {
  it("releases a conflicting selection and stops its local move", () => {
    const state = setup();
    state.interactionRef.current = {
      type: "moving",
      start: { x: 0, y: 0 },
      original: [],
      preview: [],
      objectIds: ["first"],
      moved: true,
    };

    handleRemotePresenceCommand({
      ...state.dependencies,
      command: { type: "selection", objectIds: ["first"] },
    });

    expect(state.selectedObjectIdsRef.current).toEqual(["second"]);
    expect(state.setSelectedObjectIds).toHaveBeenCalledWith(["second"]);
    expect(state.selectedObjectIdRef.current).toBe("second");
    expect(state.setSelectedObjectId).toHaveBeenCalledWith("second");
    expect(state.interactionRef.current.type).toBe("idle");
    expect(state.send).toHaveBeenCalledWith({
      type: "selection",
      objectIds: ["second"],
    });
    expect(state.remotePresence.get("peer")?.selectedObjectIds).toEqual(["first"]);
    expect(state.requestRender).toHaveBeenCalledOnce();
  });

  it("replaces an existing object preview and clears it when requested", () => {
    const state = setup();

    for (const x of [10, 20]) {
      handleRemotePresenceCommand({
        ...state.dependencies,
        command: {
          type: "objectPreview",
          previewType: "update",
          objects: [{ boardObjectId: "first", updates: { x } }],
        },
      });
    }

    expect(state.remotePresence.get("peer")?.previews).toEqual([
      { type: "update", objectId: "first", updates: { x: 20 } },
    ]);
    expect(state.selectedObjectIdRef.current).toBeNull();

    handleRemotePresenceCommand({
      ...state.dependencies,
      command: { type: "objectPreview", previewType: "clear" },
    });

    expect(state.remotePresence.get("peer")?.previews).toEqual([]);
    expect(state.remotePresence.get("peer")?.preview).toBeUndefined();
    expect(state.requestRender).toHaveBeenCalledTimes(3);
  });
});
