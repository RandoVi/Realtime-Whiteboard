import { expect, it, vi } from "vitest";
import type { Rectangle } from "@common/shapes";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { updateResize } from "./updateResize";
import { handleResizeMouseUp } from "./finishResize";

it("previews resized dimensions and commits them on mouse up", () => {
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

  const send = vi.fn();
  const execute = vi.fn();

  const context = {
    interactionRef: {
      current: {
        type: "resizing",
        objectId: rectangle.id,
        original: structuredClone(rectangle),
        preview: structuredClone(rectangle),
        handle: "se",
        offset: { x: 0, y: 0 },
      },
    },
    document: { objectsRef: { current: [rectangle] } },
    presence: { send },
    editor: { execute },
    requestRender: vi.fn(),
  } as unknown as CanvasInteractionContext;

  expect(
    updateResize({
      world: { x: 140, y: 80 },
      context,
      constrain: false,
    }),
  ).toBe(true);

  expect(send).toHaveBeenCalledWith({
    type: "objectPreview",
    previewType: "update",
    objects: [
      {
        boardObjectId: rectangle.id,
        updates: expect.objectContaining({
          width: 140,
          height: 80,
        }),
      },
    ],
  });
  expect(rectangle.width).toBe(100); // Only the preview has changed.

  expect(handleResizeMouseUp({ context })).toBe(true);
  expect(execute).toHaveBeenCalledWith({
    type: "updateBoardObject",
    boardObjectId: rectangle.id,
    updates: expect.objectContaining({
      width: 140,
      height: 80,
    }),
  });
  expect(context.interactionRef.current.type).toBe("idle");
});