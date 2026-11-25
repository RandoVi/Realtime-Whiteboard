import { describe, expect, it, vi } from "vitest";
import type { Rectangle } from "@common/shapes";
import type { Collaboration } from "../network/collaboration/Collaboration";
import { createDocument } from "../document/createDocument";
import { createEditor } from "./createEditor";

vi.mock("../network/currentUser", () => ({
  getCurrentUser: () => ({ userId: "test-user" }),
}));

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

function setup() {
  const document = createDocument([structuredClone(rectangle)]);
  const send = vi.fn();

  const editor = createEditor({
    document,
    selectedObjectIdRef: { current: null },
    setSelectedObjectId: vi.fn(),
    requestRender: vi.fn(),
    collaboration: { send } as unknown as Collaboration,
    onDocumentChange: vi.fn(),
  });

  return { document, editor, send };
}

describe("createEditor history", () => {
  it("undoes and redoes a local update", () => {
    const { document, editor, send } = setup();

    editor.execute({
      type: "updateBoardObject",
      boardObjectId: rectangle.id,
      updates: { fill: "#ff0000" },
    });

    expect(document.objectsRef.current[0]).toMatchObject({
      fill: "#ff0000",
    });
    expect(editor.canUndo()).toBe(true);

    editor.undo();

    expect(document.objectsRef.current[0]).toMatchObject({
      fill: "#ffffff",
    });
    expect(editor.canRedo()).toBe(true);

    editor.redo();

    expect(document.objectsRef.current[0]).toMatchObject({
      fill: "#ff0000",
    });
    expect(send).toHaveBeenCalledTimes(3); // Edit, undo, redo.
  });

  it("does not undo a local edit after a peer updates the same object", () => {
    const { document, editor, send } = setup();

    editor.execute({
      type: "updateBoardObject",
      boardObjectId: rectangle.id,
      updates: { fill: "#ff0000" },
    });

    editor.execute(
      {
        type: "updateBoardObject",
        boardObjectId: rectangle.id,
        updates: { fill: "#0000ff" },
      },
      { broadcast: false, recordHistory: false },
    );

    expect(editor.canUndo()).toBe(false);

    editor.undo();

    expect(document.objectsRef.current[0]).toMatchObject({
      fill: "#0000ff",
    });
    expect(send).toHaveBeenCalledTimes(1); // The peer edit is not rebroadcast.
  });
});