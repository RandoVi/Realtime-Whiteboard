import { afterEach, describe, expect, it, vi } from "vitest";
import type { CanvasText, Rectangle } from "@common/shapes";
import type { Collaboration } from "../network/collaboration/Collaboration";
import { createDocument } from "../document/createDocument";
import { createEditor } from "./createEditor";

vi.mock("../network/currentUser", () => ({
  getCurrentUser: () => ({ userId: "test-user" }),
}));

afterEach(() => vi.unstubAllGlobals());

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
  it("restores a deleted object on undo", () => {
    const { document, editor } = setup();

    editor.execute({
      type: "deleteBoardObject",
      boardObjectId: rectangle.id,
    });

    expect(document.objectsRef.current).toEqual([]);

    editor.undo();
    expect(document.objectsRef.current).toEqual([rectangle]);

    editor.redo();
    expect(document.objectsRef.current).toEqual([]);
  });

  it("fits a new text object before applying and broadcasting it", () => {
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => ({
          font: "",
          measureText: (text: string) => ({ width: text.length * 10 }),
        }),
      }),
    });

    const text: CanvasText = {
      id: "text-1",
      type: "text",
      x: 0,
      y: 0,
      width: 40,
      height: 20,
      rotation: 0,
      text: "hello",
      fontSize: 20,
      fontFamily: "Arial",
      fontWeight: 400,
      fill: "#000000",
    };

    const { document, editor, send } = setup();
    editor.execute({ type: "createBoardObject", boardObject: text });

    const fitted = { ...text, width: 76, height: 54 };
    expect(document.objectsRef.current[1]).toEqual(fitted);
    expect(send).toHaveBeenCalledWith({
      type: "createBoardObject",
      boardObject: fitted,
    });
    expect(text).toMatchObject({ width: 40, height: 20 });
  });

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
