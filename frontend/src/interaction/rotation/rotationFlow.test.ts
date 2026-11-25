import { expect, it, vi } from "vitest";
import type { Rectangle } from "@common/shapes";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { beginRotation } from "./beginRotation";
import { updateRotation } from "./updateRotation";
import { finishRotation } from "./finishRotation";

it("previews a rotation and commits it when the drag finishes", () => {
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
    document: { objectsRef: { current: [rectangle] } },
    editor: { execute },
    presence: { send },
    requestRender,
  } as unknown as CanvasInteractionContext;

  expect(
    beginRotation({
      object: rectangle,
      interactionRef: context.interactionRef,
      context,
    }),
  ).toBe(true);

  expect(execute).toHaveBeenCalledWith({
    type: "bringBoardObjectToFront",
    boardObjectId: rectangle.id,
  });

  // The rectangle's center is (50, 25). Moving right of it gives
  // angle 0 + PI/2, so the preview rotation is 90 degrees.
  expect(
    updateRotation({
      world: { x: 100, y: 25 },
      context,
    }),
  ).toBe(true);

  if (context.interactionRef.current.type !== "rotating") {
    throw new Error("Expected an active rotation");
  }

  expect(context.interactionRef.current.original.rotation).toBe(0);
  expect(context.interactionRef.current.preview.rotation).toBeCloseTo(
    Math.PI / 2,
  );
  expect(rectangle.rotation).toBe(0); // The saved object is unchanged so far.

  expect(send).toHaveBeenCalledWith({
    type: "objectPreview",
    previewType: "update",
    objects: [
      {
        boardObjectId: rectangle.id,
        updates: { rotation: Math.PI / 2 },
      },
    ],
  });

  expect(finishRotation({ context })).toBe(true);
  expect(execute).toHaveBeenLastCalledWith({
    type: "updateBoardObject",
    boardObjectId: rectangle.id,
    updates: { rotation: Math.PI / 2 },
  });
  expect(context.interactionRef.current.type).toBe("idle");
  expect(requestRender).toHaveBeenCalledTimes(2);
});