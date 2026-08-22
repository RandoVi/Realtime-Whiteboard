import type { MutableRefObject } from "react";
import type { Editor } from "./Editor";
import { getObjectById } from "../objects/getObjectById";
import { updateObject } from "./commands/updateObject";
import { deleteObject } from "./commands/deleteObject";
import type { EditorCommand } from "@common/commands";
import { insertObject } from "./commands/insertObject";
import type { BoardDocument } from "../document/Document";
import type { Collaboration } from "../network/collaboration/Collaboration";
import type { ExecuteOptions } from "./Editor";
import { duplicateObject } from "./duplicateObject";
import { bringObjectToFront } from "../interaction/helpers/bringObjectToFront";
import { EditorHistory } from "./history/EditorHistory";
import type { BoardObject } from "@common/types";
import type { HistoryEntry } from "./history/HistoryEntry";
import { getCurrentUser } from "../network/currentUser";

type Args = {
  document: BoardDocument;

  selectedObjectIdRef: MutableRefObject<string | null>;

  setSelectedObjectId: (id: string | null) => void;

  requestRender: () => void;

  collaboration: Collaboration;

  onDocumentChange: () => void;
};


export function createEditor({
  document,
  selectedObjectIdRef,
  setSelectedObjectId,
  requestRender,
  collaboration,
  onDocumentChange,
}: Args): Editor {


  const history = new EditorHistory();
  const objectVersions = new Map<string, number>();

  function getObjectVersion(objectId: string): number {
    return objectVersions.get(objectId) ?? 0;
  }

  function incrementObjectVersion(objectId: string): number {
    const previous = getObjectVersion(objectId);

    const next = previous + 1;

    objectVersions.set(objectId, next);

    // console.log(
    //   "[VERSION]",
    //   objectId,
    //   `${previous} -> ${next}`
    // );

    return next;
  }

  function setObjectVersion(
    objectId: string,
    version: number
  ): void {
    objectVersions.set(objectId, version);

    // console.log(
    //   "[VERSION]",
    //   objectId,
    //   `-> ${version}`
    // );
  }

  function getAffectedObjectIds(
    command: EditorCommand
  ): string[] {
    switch (command.type) {
      case "createBoardObject":
        return [command.boardObject.id];

      case "updateBoardObject":
        return [command.boardObjectId];

      case "deleteBoardObject":
        return [command.boardObjectId];

      case "bringBoardObjectToFront":
        return [];
    }
  }


  function resetHistory() {
    history.clear();
    objectVersions.clear();
  }


  function canUndoEntry(
    entry: HistoryEntry
  ): boolean {

    for (const [objectId, version] of Object.entries(
      entry.afterVersions
    )) {

      const currentVersion =
        getObjectVersion(objectId);

      if (currentVersion !== version) {
        return false;
      }
    }

    return true;
  }

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

    const duplicated = duplicateObject(object);

    if (!duplicated) {
      throw new Error(`Cannot duplicate ${object.type}`)
    }

    execute({
      type: "createBoardObject",
      boardObject: duplicated,
    });

    selectedObjectIdRef.current = duplicated.id;
    setSelectedObjectId(duplicated.id);
  }

  // Bind a property of the selected object to an input field
  function bindProperty(property: string) {
    return (value: unknown) => {
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

  function createInverseCommand(
    command: EditorCommand
  ): EditorCommand | undefined {
    switch (command.type) {

      case "createBoardObject":
        return {
          type: "deleteBoardObject",
          boardObjectId: command.boardObject.id,
        };

      case "deleteBoardObject": {
        const object = getObjectById(
          document.objectsRef.current,
          command.boardObjectId
        );

        if (!object) {
          return undefined;
        }

        return {
          type: "createBoardObject",
          boardObject: structuredClone(object),
        };
      }

      case "updateBoardObject": {
        const object = getObjectById(
          document.objectsRef.current,
          command.boardObjectId,
        );

        if (!object) {
          return undefined;
        }

        const previousValues: Record<string, unknown> = {};

        for (const property of Object.keys(command.updates)) {
          previousValues[property] = structuredClone(
            object[property as keyof typeof object]
          );
        }

        return {
          type: "updateBoardObject",
          boardObjectId: command.boardObjectId,
          updates: previousValues as Partial<BoardObject>,
        };
      }

      case "bringBoardObjectToFront":
        return undefined;
    }
  }

  function apply(command: EditorCommand) {
    switch (command.type) {
      case "createBoardObject":
        insertObject({
          objects: document.objectsRef.current,
          object: command.boardObject,
        });
        break;

      case "updateBoardObject":
        // console.log("APPLYING REMOTE UPDATE:", command);
        updateObject({
          objects: document.objectsRef.current,
          objectId: command.boardObjectId,
          updates: command.updates,
        });
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

      case "bringBoardObjectToFront":
        bringObjectToFront({
          objects: document.objectsRef.current,
          objectId: command.boardObjectId,
        });
        break;
    }
  }

  function execute(
    command: EditorCommand,
    options?: ExecuteOptions
  ): Record<string, number> {

    const shouldRecordHistory =
      options?.recordHistory !== false;

    const affectedObjectIds =
      getAffectedObjectIds(command);

    let inverseCommand: EditorCommand | undefined;

    if (shouldRecordHistory) {
      inverseCommand = createInverseCommand(command);
    }

    const beforeVersions: Record<string, number> = {};

    for (const objectId of affectedObjectIds) {
      beforeVersions[objectId] =
        getObjectVersion(objectId);
    }

    apply(command);

    const afterVersions: Record<string, number> = {};

    for (const objectId of affectedObjectIds) {
      const version =
        incrementObjectVersion(objectId);

      afterVersions[objectId] = version;
    }

    if (shouldRecordHistory && inverseCommand) {
      const currentUser = getCurrentUser();

      if (currentUser) {
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          userId: currentUser.userId,
          timestamp: Date.now(),

          command,
          inverseCommand,

          beforeVersions,
          afterVersions,
        };

        history.push(entry);
      }
    }

    if (options?.broadcast !== false) {
      collaboration.send(command);
    }

    requestRender();
    onDocumentChange();

    return afterVersions;
  }

  function undo() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return;
    }

    const entry = history.findUndoCandidate(
      entry =>
        entry.userId === currentUser.userId &&
        canUndoEntry(entry)
    );

    if (!entry) {
      return;
    }

    const removed =
      history.removeUndo(entry);

    if (!removed) {
      return;
    }

    execute(entry.inverseCommand, {
      recordHistory: false,
    });

    for (const [objectId, version] of Object.entries(
      entry.beforeVersions
    )) {
      setObjectVersion(objectId, version);
    }

    history.pushRedo(entry);
  }

  function redo() {
    const entry = history.popRedo();

    if (!entry) {
      return;
    }

    execute(entry.command, {
      recordHistory: false,
    });

    for (const [objectId, version] of Object.entries(
      entry.afterVersions
    )) {
      setObjectVersion(objectId, version);
    }

    history.pushUndo(entry);
  }

  return {
    bindProperty,
    execute,
    undo,
    redo,
    canUndo: () => history.canUndo(),
    canRedo: () => history.canRedo(),
    resetHistory,
    getSelectedObject,
    deleteSelectedObject,
    duplicateSelectedObject,
  };
}