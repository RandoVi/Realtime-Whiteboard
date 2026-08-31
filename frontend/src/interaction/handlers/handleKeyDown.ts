import type { Editor } from "../../editor/Editor"

type Args = {
  setShowCoordinates: React.Dispatch<React.SetStateAction<boolean>>
  getSelectedObjectId: () => string | null
  editor: Editor
  updateInteractionAtCurrentPointer: (constrain: boolean) => void;
}
// Handles key down events for the whiteboard application, including toggling 
// coordinate display and deleting selected objects
export function handleKeyDown({
  setShowCoordinates,
  getSelectedObjectId,
  editor,
  updateInteractionAtCurrentPointer,
}: Args) {
  return (event: KeyboardEvent) => {
    // Ctrl pressed
    if (event.key === "Control" && !event.repeat) {
      updateInteractionAtCurrentPointer(true);
      return;
    }

    // Undo
    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "z" &&
      !event.repeat
    ) {
      event.preventDefault();

      if (event.shiftKey) {
        editor.redo();
      } else {
        editor.undo();
      }

      return;
    }

    // Redo
    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "y" &&
      !event.repeat
    ) {
      event.preventDefault();

      editor.redo();

      return;
    }

    // Toggle coordinates
    if (
      event.key.toLowerCase() === "m" &&
      !event.repeat
    ) {
      setShowCoordinates((value) => !value);
      return;
    }

    // Delete selected object
    if (
      event.key === "Delete" ||
      event.key === "Backspace"
    ) {
      const boardObjectId = getSelectedObjectId();

      if (!boardObjectId) {
        return;
      }

      editor.execute({
        type: "deleteBoardObject",
        boardObjectId,
      });
    }
  };
}