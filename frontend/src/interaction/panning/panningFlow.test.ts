import { expect, it, vi } from "vitest";
import type { CanvasInteractionContext } from "../CanvasInteractionContext";
import { beginPan } from "./beginPan";
import { updatePan } from "./updatePan";
import { finishPan } from "./finishPan";

it("moves the camera by each pointer delta and stops when panning ends", () => {
  const canvas = {
    style: { cursor: "default" },
  } as unknown as HTMLCanvasElement;

  const requestRender = vi.fn();
  const context = {
    canvas,
    cameraRef: {
      current: { scale: 2, offsetX: 10, offsetY: 20 },
    },
    interactionRef: { current: { type: "idle" } },
    requestRender,
  } as unknown as CanvasInteractionContext;

  beginPan({
    pointer: { x: 100, y: 80 },
    canvas,
    context,
  });

  expect(context.interactionRef.current.type).toBe("panning");
  expect(canvas.style.cursor).toBe("grabbing");

  // Pointer delta: (+30, -30).
  expect(
    updatePan({ pointer: { x: 130, y: 50 }, context }),
  ).toBe(true);
  expect(context.cameraRef.current).toEqual({
    scale: 2,
    offsetX: 40,
    offsetY: -10,
  });

  // The next delta is (+10, +15), measured from the previous pointer.
  expect(
    updatePan({ pointer: { x: 140, y: 65 }, context }),
  ).toBe(true);
  expect(context.cameraRef.current).toEqual({
    scale: 2,
    offsetX: 50,
    offsetY: 5,
  });
  expect(requestRender).toHaveBeenCalledTimes(2);

  expect(finishPan({ context })).toBe(true);
  expect(context.interactionRef.current.type).toBe("idle");

  expect(
    updatePan({ pointer: { x: 200, y: 200 }, context }),
  ).toBe(false);
  expect(context.cameraRef.current).toEqual({
    scale: 2,
    offsetX: 50,
    offsetY: 5,
  });
  expect(requestRender).toHaveBeenCalledTimes(2);
});