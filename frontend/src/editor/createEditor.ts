import type { MutableRefObject } from "react";
import type { Object } from "../types/Object";
import type { Editor } from "./Editor";
import { getObjectById } from "../objects/getObjectById";
import type { ChangeEvent } from "react";
import { updateObject } from "./commands/updateObject";
import { deleteObject } from "./commands/deleteObject";
import type { EditorCommand } from "./EditorCommand";
import { createObject } from "./commands/createObject";
import type { Document } from "../document/Document";
import type { Collaboration } from "../socket/collaboration/Collaboration";
import type { ExecuteOptions } from "./Editor";

type Args = {
  document: Document;
  selectedObjectIdRef: MutableRefObject<string | null>;

  setSelectedObjectId: (id: string | null) => void;

  requestRender: () => void;

  collaboration: Collaboration;
};



export function createEditor({
  document,
  selectedObjectIdRef,
  setSelectedObjectId,
  requestRender,
  collaboration,
}: Args): Editor {
  function getSelectedObject() {
    if (!selectedObjectIdRef.current) {
      return undefined;
    }

    return getObjectById(
      document.objectsRef.current,
      selectedObjectIdRef.current
    );
  }

  function deleteSelectedObject() {

    const objectId = selectedObjectIdRef.current

    if (!objectId) {
      return
    }


    execute({
      type: "deleteBoardObject",
      boardObjectId: objectId,
    })

  }

  function duplicateSelectedObject() {

    const object = getSelectedObject();

    if (!object) {
      return;
    }

    const duplicated = {
      ...object,
      id: crypto.randomUUID(),
      x: object.x + 20,
      y: object.y + 20,
    };

    execute({
      type: "createBoardObject",
      boardObject: duplicated,
    });
  }

  // Bind a property of the selected object to an input field
  function bind<K extends keyof Object>(
    property: K,
    transform?: (value: string) => Object[K]
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;

      const value = transform
        ? transform(raw)
        : (raw as Object[K]);

      const object = getSelectedObject();

      if (!object) {
        return;
      }

      execute({
        type: "updateBoardObject",
        boardObjectId: object.id,
        updates: {
          [property]: value,
        },
      });
    };
  }

  function apply(command: EditorCommand) {
    switch (command.type) {
      case "createBoardObject":
        createObject({
          objects: document.objectsRef.current,
          object: command.boardObject,
        });
        break;

      case "updateBoardObject":
        updateObject({
          objects: document.objectsRef.current,
          objectId: command.boardObjectId,
          updates: command.updates,
        });
        console.table(
          document.objectsRef.current.map(object => ({
            id: object.id,
            x: object.x,
            y: object.y,
            width: object.width,
            height: object.height,
          }))
        );
        break;

      case "deleteBoardObject":
        deleteObject({
          objects: document.objectsRef.current,
          objectId: command.boardObjectId,
        });

        if (selectedObjectIdRef.current === command.boardObjectId) {
          selectedObjectIdRef.current = null;
          setSelectedObjectId(null);
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
    deleteSelectedObject,
    duplicateSelectedObject,
  };
}