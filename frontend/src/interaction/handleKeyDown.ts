import type { Editor } from "../editor/Editor"

type Args = {
  setShowCoordinates: React.Dispatch<React.SetStateAction<boolean>>
  getSelectedObjectId: () => string | null
  editor: Editor
}
// Handles key down events for the whiteboard application, including toggling 
// coordinate display and deleting selected objects
export function handleKeyDown({
  setShowCoordinates,
  getSelectedObjectId,
  editor,
}: Args) {
  return (event: KeyboardEvent) => {

    if (event.key.toLowerCase() === 'm' && !event.repeat) {
      setShowCoordinates((value) => !value)
      return
    }


    if (
      event.key === "Delete" ||
      event.key === "Backspace"
    ) {

      const boardObjectId = getSelectedObjectId()

      if (!boardObjectId) {
        return
      }


      editor.execute({
        type: "deleteBoardObject",
        boardObjectId,
      })

    }
  }
}