import { describe, expect, it, vi } from "vitest";
import type { Point } from "@common/types";
import type { Rectangle } from "@common/shapes";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { finishSelection } from "./finishSelection";

const first: Rectangle = {
  id: "first",
  type: "rectangle",
  x: 10,
  y: 10,
  width: 20,
  height: 20,
  rotation: 0,
  fill: "#ffffff",
  stroke: "#000000",
  strokeWidth: 2,
};

function makeContext(current: Point) {
  const setSelectedObjectIds = vi.fn();
  const setSelectedObjectId = vi.fn();
  const send = vi.fn();
  const requestRender = vi.fn();

  const context = {
    interactionRef: {
      current: {
        type: "selecting",
        start: { x: 0, y: 0 },
        current,
      },
    },
    document: {
      objectsRef: {
        current: [
          first,
          { ...first, id: "second", x: 25 },
          { ...first, id: "outside", x: 100 },
        ],
      },
    },
    selectedObjectIdsRef: { current: ["previous"] },
    selectedObjectIdRef: { current: "previous" },
    setSelectedObjectIds,
    setSelectedObjectId,
    presence: { send },
    requestRender,
  } as unknown as CanvasInteractionContext;

  return {
    context,
    setSelectedObjectIds,
    setSelectedObjectId,
    send,
    requestRender,
  };
}

describe("finishSelection", () => {
  it("stores selected IDs and announces them when a drag ends", () => {
    const {
      context,
      setSelectedObjectIds,
      setSelectedObjectId,
      send,
      requestRender,
    } = makeContext({ x: 50, y: 50 });

    finishSelection({ context });

    expect(context.selectedObjectIdsRef.current).toEqual(["first", "second"]);
    expect(setSelectedObjectIds).toHaveBeenCalledWith(["first", "second"]);
    expect(context.selectedObjectIdRef.current).toBe("first");
    expect(setSelectedObjectId).toHaveBeenCalledWith("first");
    expect(send).toHaveBeenCalledWith({
      type: "selection",
      objectIds: ["first", "second"],
    });
    expect(context.interactionRef.current.type).toBe("idle");
    expect(requestRender).toHaveBeenCalledOnce();
  });

  it("clears selection when the pointer barely moved", () => {
    const {
      context,
      setSelectedObjectIds,
      setSelectedObjectId,
      send,
    } = makeContext({ x: 1, y: 1 });

    finishSelection({ context });

    expect(context.selectedObjectIdsRef.current).toEqual([]);
    expect(setSelectedObjectIds).toHaveBeenCalledWith([]);
    expect(context.selectedObjectIdRef.current).toBeNull();
    expect(setSelectedObjectId).toHaveBeenCalledWith(null);
    expect(send).toHaveBeenCalledWith({
      type: "selection",
      objectIds: [],
    });
    expect(context.interactionRef.current.type).toBe("idle");
  });
});