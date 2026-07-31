type Args = {
  selectObject: (id: string | null) => void
  requestRender: () => void
}
// Handles the mouse down event for clearing the selection of objects on the whiteboard
export function handleSelectionClearMouseDown({
  selectObject,
  requestRender,
}: Args) {
  selectObject(null)
  requestRender()
}