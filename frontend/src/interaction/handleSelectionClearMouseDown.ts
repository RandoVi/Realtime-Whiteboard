type Args = {
  selectShape: (id: string | null) => void
  requestRender: () => void
}
// Handles the mouse down event for clearing the selection of shapes on the whiteboard
export function handleSelectionClearMouseDown({
  selectShape,
  requestRender,
}: Args) {
  selectShape(null)
  requestRender()
}