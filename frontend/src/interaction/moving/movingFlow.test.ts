import { expect, it, vi } from "vitest";
import type { Rectangle } from "@common/shapes";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { beginMoving } from "./beginMoving";
import { updateMoving } from "./updateMoving";
import { finishMoving } from "./finishMoving";

it("ignores tiny movement, then previews and commits a drag", () => {
  const rectangle: Rectangle = {
    id: "rectangle-1",
    type: "rectangle",
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    rotation: 0,
    fill: "#ffffff",
    stroke: "#000000",
    strokeWidth: 2,
  };

  const execute = vi.fn();
  const send = vi.fn();
  const requestRender = vi.fn();

  const context = {
    interactionRef: { current: { type: "idle" } },
    selectedObjectIdsRef: { current: [rectangle.id] },
    document: { objectsRef: { current: [rectangle] } },
    editor: { execute },
    presence: { send },
    requestRender,
  } as unknown as CanvasInteractionContext;

  expect(
    beginMoving({
      clickedObject: rectangle,
      world: { x: 10, y: 10 },
      interactionRef: context.interactionRef,
      selectObject: vi.fn(),
      requestRender,
      context,
    }),
  ).toBe(true);

  expect(execute).toHaveBeenCalledWith({
    type: "bringBoardObjectsToFront",
    boardObjectIds: [rectangle.id],
  });

  expect(updateMoving({ world: { x: 11, y: 12 }, context })).toBe(true);
  expect(send).not.toHaveBeenCalled(); // Still within the drag threshold.

  expect(updateMoving({ world: { x: 30, y: 35 }, context })).toBe(true);

  if (context.interactionRef.current.type !== "moving") {
    throw new Error("Expected an active move");
  }

  expect(context.interactionRef.current.preview[0]).toMatchObject({
    x: 20,
    y: 25,
  });
  expect(rectangle).toMatchObject({ x: 0, y: 0 });

  expect(send).toHaveBeenCalledWith({
    type: "objectPreview",
    previewType: "update",
    objects: [
      {
        boardObjectId: rectangle.id,
        updates: { x: 20, y: 25, rotation: 0 },
      },
    ],
  });

  expect(finishMoving({ context })).toBe(true);
  expect(execute).toHaveBeenLastCalledWith({
    type: "updateBoardObject",
    boardObjectId: rectangle.id,
    updates: { x: 20, y: 25, rotation: 0 },
  });
  expect(send).toHaveBeenLastCalledWith({
    type: "objectPreview",
    previewType: "clear",
  });
  expect(context.interactionRef.current.type).toBe("idle");
});