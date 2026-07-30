import type { MutableRefObject } from "react";
import type { Shape } from "../types/Shape";
import type { Editor } from "./Editor";
import { getShapeById } from "../shapes/getShapeById";
import type { ChangeEvent } from "react";
import { updateShape } from "./commands/updateShape";
import { deleteShape } from "./commands/deleteShape";
// import { duplicateShape } from "./commands/duplicateShape";
import type { EditorCommand } from "./EditorCommand";
import { createShape } from "./commands/createShape";
import type { Document } from "../document/Document";
import type { Collaboration } from "../socket/collaboration/Collaboration";
import type { ExecuteOptions } from "./Editor";

type Args = {
  document: Document;
  selectedShapeIdRef: MutableRefObject<string | null>;

  setSelectedShapeId: (id: string | null) => void;

  requestRender: () => void;

  collaboration: Collaboration;
};



export function createEditor({
  document,
  selectedShapeIdRef,
  setSelectedShapeId,
  requestRender,
  collaboration,
}: Args): Editor {
  function getSelectedShape() {
    if (!selectedShapeIdRef.current) {
      return undefined;
    }

    return getShapeById(
      document.shapesRef.current,
      selectedShapeIdRef.current
    );
  }

  function deleteSelectedShape() {

    const shapeId = selectedShapeIdRef.current

    if (!shapeId) {
      return
    }


    execute({
      type: "deleteBoardObject",
      boardObjectId: shapeId,
    })

  }

  function duplicateSelectedShape() {

    const shape = getSelectedShape();

    if (!shape) {
      return;
    }

    const duplicated = {
      ...shape,
      id: crypto.randomUUID(),
      x: shape.x + 20,
      y: shape.y + 20,
    };

    execute({
      type: "createBoardObject",
      boardObject: duplicated,
    });
  }

  function bind<K extends keyof Shape>(
    property: K,
    transform?: (value: string) => Shape[K]
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;

      const value = transform
        ? transform(raw)
        : (raw as Shape[K]);

      const shape = getSelectedShape();

      if (!shape) {
        return;
      }

      execute({
        type: "updateBoardObject",
        boardObjectId: shape.id,
        updates: {
          [property]: value,
        },
      });
    };
  }

  function apply(command: EditorCommand) {
    switch (command.type) {
      case "createBoardObject":
        createShape({
          shapes: document.shapesRef.current,
          shape: command.boardObject,
        });
        break;

      case "updateBoardObject":
        updateShape({
          shapes: document.shapesRef.current,
          shapeId: command.boardObjectId,
          updates: command.updates,
        });
        console.table(
          document.shapesRef.current.map(shape => ({
            id: shape.id,
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
          }))
        );
        break;

      case "deleteBoardObject":
        deleteShape({
          shapes: document.shapesRef.current,
          shapeId: command.boardObjectId,
        });

        if (selectedShapeIdRef.current === command.boardObjectId) {
          selectedShapeIdRef.current = null;
          setSelectedShapeId(null);
        }

        break;
    }
  }

  function execute(
    command: EditorCommand,
    options?: ExecuteOptions
  ) {
    console.log(command.type);
    apply(command);

    if (options?.broadcast !== false) {
      collaboration.send(command);
    }

    requestRender();
  }

  return {
    bind,
    execute,
    deleteSelectedShape,
    duplicateSelectedShape,
  };
}