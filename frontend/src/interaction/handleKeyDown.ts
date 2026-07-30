import type { Editor } from "../editor/Editor"

type Args = {
  setShowCoordinates: React.Dispatch<React.SetStateAction<boolean>>
  getSelectedShapeId: () => string | null
  editor: Editor
}

export function handleKeyDown({
  setShowCoordinates,
  getSelectedShapeId,
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

      const boardObjectId = getSelectedShapeId()

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