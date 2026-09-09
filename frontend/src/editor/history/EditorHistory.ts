import type { HistoryEntry } from "./HistoryEntry";

export class EditorHistory {
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];

  push(entry: HistoryEntry): void {
    this.undoStack.push(entry);
    this.redoStack = [];
  }

  popUndo(): HistoryEntry | undefined {
    return this.undoStack.pop();
  }

  pushUndo(entry: HistoryEntry): void {
    this.undoStack.push(entry);
  }

  popRedo(): HistoryEntry | undefined {
    return this.redoStack.pop();
  }

  pushRedo(entry: HistoryEntry): void {
    this.redoStack.push(entry);
  }

  peekUndo(): HistoryEntry | undefined {
    return this.undoStack[
      this.undoStack.length - 1
    ];
  }

  findUndoCandidate(
    predicate: (entry: HistoryEntry) => boolean
  ): HistoryEntry | undefined {
    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      const entry = this.undoStack[i];

      if (predicate(entry)) {
        return entry;
      }
    }

    return undefined;
  }

  removeUndo(entry: HistoryEntry): boolean {
    const index = this.undoStack.indexOf(entry);

    if (index === -1) {
      return false;
    }

    this.undoStack.splice(index, 1);
    return true;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}